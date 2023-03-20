import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { validate } from 'class-validator';
import { USQL } from 'src/module-utilities/usql';
import { ProjectCreate } from '../dtos/create.project.dto';

interface User {
    use_code: string;
    use_name: string;
}

@Injectable()
export class ProjectsService {

    constructor(
        private uSql: USQL) {

    }

    contextClass = "ProjectsService - ";

    async getAllProjects() {
        const method = `${this.contextClass} getAllProjects`;
        try {
            let projects = await this.uSql.makeQuery(`
            SELECT  pro_code, pro_title, pro_descri, 
                    TO_CHAR(pro_datins, 'DD Mon YYYY HH:mm PM') pro_datfor, 
                    pro_datupd, pro_datins, pro_datstart, pro_datend,
                    COALESCE(sch_projects.fun_get_project_users(pro_code), '[]') as pro_users 
            FROM sch_projects.tb_project
            `, [])

            if (!projects.length) {
                return {
                    result: 'success',
                    message: "No projects were found",
                };
            }
            return { result: "success", data: projects, message: "All projects retrieved" };
        } catch (e) {
            console.log("Exception at: " + method);
        }
    }

    async createProject(createProject: ProjectCreate) {
        const method = `${this.contextClass} createProject`;

        try {
            // Perform input validation using class-validator decorators
            const errors = await validate(createProject);
            if (errors.length > 0) {
                return { result: "success", message: "Some values are not correct or are missing", data: "" };
            }

            // Perform database insert and return created user
            const query = `
            INSERT INTO sch_projects.tb_project (pro_title, pro_descri, pro_status, pro_datins, pro_datupd, use_code, pro_datstart, pro_datend)
            VALUES ($1, $2, $3, NOW(), NOW(), $4, $5, $6) RETURNING pro_code, pro_datins;`;
            const params = [createProject.pro_title, createProject.pro_descri, createProject.pro_status,
            createProject.use_code, createProject.pro_datstart, createProject.pro_datend];

            const result = await this.uSql.makeQuery(query, params);
            if (!result[0]) {
                return {
                    result: 'fail',
                    message: "Couldn't create the project",
                };
            }
            const createdProject = result[0];
            let project = { ...createProject, ...createdProject };

            //Adds users
            let users = createProject.pro_users as { use_code: string, use_name: string }[];
            if (users.length > 0) {
                let useCodes = users.map(user => user.use_code); // Extract the use_code values
                let useCodeString = useCodes.join(',');

                const query2 = `
                SELECT sch_projects.fun_add_users_to_project($1, $2);`;
                const params2 = [useCodeString, createdProject.pro_code];
                const result2 = await this.uSql.makeQuery(query2, params2);

                if (!result2[0]["fun_add_users_to_project"]) {
                    return {
                        result: 'fail',
                        message: "Couldn't add the users",
                    };
                }
            }

            return { result: "success", message: "Project has been created", data: project };
        } catch (error) {
            throw new InternalServerErrorException(`Error in ${method}: ${error}`);
        }
    }

}
