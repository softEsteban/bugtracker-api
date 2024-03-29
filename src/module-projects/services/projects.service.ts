import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { validate } from 'class-validator';
import { USQL } from '../../module-utilities/usql';
import { CreateProject } from '../dtos/create.project.dto';
import { AddUsers } from '../dtos/add.users.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';


@Injectable()
export class ProjectsService {

    constructor(
        @InjectRepository(Project) private projectRepository: Repository<Project>,
        private uSql: USQL) {

    }

    contextClass = "ProjectsService - ";

    /**
     * 
     */
    async getAllProjects() {
        const method = `${this.contextClass} getAllProjects`;
        try {
            let projects = await this.uSql.makeQuery(`
            SELECT  
                project.pro_code, project.pro_title, project.pro_descri, 
                TO_CHAR(project.pro_datins, 'DD Mon YYYY HH:mm PM') pro_datfor, 
                project.pro_datupd, project.pro_datins, project.pro_datstart, project.pro_datend,
                COALESCE(sch_projects.fun_get_project_users(project.pro_code), '[]') AS pro_users,
                (SELECT COUNT(1) FROM sch_projects.tb_item WHERE pro_code = project.pro_code AND item_type = 'Issue') AS issue_count,
                (SELECT COUNT(1) FROM sch_projects.tb_item WHERE pro_code = project.pro_code AND item_type = 'Ticket') AS ticket_count,
                (SELECT COUNT(1) FROM sch_projects.tb_project_document WHERE pro_code = project.pro_code) AS docs_count,
                ('Documents ' || (SELECT COUNT(1) FROM sch_projects.tb_project_document WHERE pro_code = project.pro_code) || 
                '  Tickets ' || (SELECT COUNT(1) FROM sch_projects.tb_item WHERE pro_code = project.pro_code AND item_type = 'Ticket') ||
                '  Issues ' || (SELECT COUNT(1) FROM sch_projects.tb_item WHERE pro_code = project.pro_code AND item_type = 'Issue')) AS counts_string
            FROM 
                sch_projects.tb_project project
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

    async getProjectsByUser(userId: string) {
        const method = `${this.contextClass} getProjectsByUser`;
        try {
            let projects = await this.uSql.makeQuery(`
            SELECT  
                Projects.pro_code, Projects.pro_title, Projects.pro_descri, 
                TO_CHAR(Projects.pro_datins, 'DD Mon YYYY HH:mm PM') pro_datfor, 
                Projects.pro_datupd, Projects.pro_datins, Projects.pro_datstart, Projects.pro_datend,
                COALESCE(sch_projects.fun_get_project_users(Projects.pro_code), '[]') AS pro_users,
                (SELECT COUNT(1) FROM sch_projects.tb_item WHERE pro_code = Projects.pro_code AND item_type = 'Issue') AS issue_count,
                (SELECT COUNT(1) FROM sch_projects.tb_item WHERE pro_code = Projects.pro_code AND item_type = 'Ticket') AS ticket_count,
                (SELECT COUNT(1) FROM sch_projects.tb_project_document WHERE pro_code = Projects.pro_code) AS docs_count,
                ('Documents ' || (SELECT COUNT(1) FROM sch_projects.tb_project_document WHERE pro_code = Projects.pro_code) || 
                '  Tickets ' || (SELECT COUNT(1) FROM sch_projects.tb_item WHERE pro_code = Projects.pro_code AND item_type = 'Ticket') ||
                '  Issues ' || (SELECT COUNT(1) FROM sch_projects.tb_item WHERE pro_code = Projects.pro_code AND item_type = 'Issue')) AS counts_string
            FROM sch_projects.tb_project Projects,
                sch_projects.tb_user_x_project TUserP
            WHERE TUserP.pro_code = Projects.pro_code
            AND TUserP.use_code = $1
            `, [userId])

            if (!projects.length) {
                return {
                    result: 'success',
                    message: "No projects were found for user",
                };
            }
            return { result: "success", data: projects, message: "All projects retrieved by user" };
        } catch (e) {
            console.log("Exception at: " + method + e);
        }
    }


    /**
     * 
     */
    async getProjectsCountByUsers() {
        const method = `${this.contextClass} getProjectsCountByUsers`;
        try {
            let users = await this.uSql.makeQuery(`
            SELECT tuser.use_code, tuser.use_name, COUNT(tusp.*) pro_count
            FROM sch_generic.tb_user tuser
            JOIN sch_projects.tb_user_x_project tusp ON tuser.use_code = tusp.use_code
            JOIN sch_projects.tb_project tpro ON tusp.pro_code = tpro.pro_code
            GROUP BY tuser.use_code, tuser.use_name
            ORDER BY pro_count DESC;
            `, [])

            if (!users.length) {
                return {
                    result: 'success',
                    message: "No projects count by users were found",
                };
            }
            return { result: "success", data: users, message: "Projects count by users retrieved" };
        } catch (e) {
            console.log("Exception at: " + method);
        }
    }

    /**
     * 
     */
    async getAdminDashboardCounts() {
        const method = `${this.contextClass} getAdminDashboardCounts`;
        try {
            let users = await this.uSql.makeQuery(`
            SELECT
                (SELECT COUNT(*) FROM sch_projects.tb_project) AS pro_count,
                (SELECT COUNT(*) FROM sch_generic.tb_user WHERE use_type='Developer') AS dev_count,
                (SELECT COUNT(*) FROM sch_generic.tb_user WHERE use_type='User') AS cli_count;
            `, [])

            if (!users.length) {
                return {
                    result: 'success',
                    message: "No projects count by users were found",
                };
            }
            return { result: "success", data: users, message: "Projects count by users retrieved" };
        } catch (e) {
            console.log("Exception at: " + method);
        }
    }

    /**
     * 
     * @param createProject 
     * @returns 
     */

    async createProject(createProject: CreateProject) {
        const method = `${this.contextClass} createProject`;

        try {
            // Performs input validation using class-validator decorators
            const errors = await validate(createProject);
            if (errors.length > 0) {
                return {
                    result: 'success',
                    message: 'Some values are not correct or are missing',
                    data: '',
                };
            }

            // Creates a new project instance with the provided data
            const project = this.projectRepository.create({
                pro_title: createProject.pro_title,
                pro_descri: createProject.pro_descri,
                pro_status: createProject.pro_status,
                pro_datins: new Date(),
                pro_datupd: new Date(),
                use_code: createProject.use_code,
                pro_datstart: createProject.pro_datstart,
                pro_datend: createProject.pro_datend
            });

            // Saves the project entity to the database
            const createdProject = await this.projectRepository.save(project);

            // Adds users
            const addUsers = new AddUsers(createdProject.pro_code.toString(), createProject.pro_users);
            await this.addUsers(addUsers);

            return { result: 'success', message: 'Project has been created', data: createdProject };
        } catch (error) {
            throw new InternalServerErrorException(`Error in ${method}: ${error}`);
        }
    }

    /**
     * 
     * @param addUsers 
     * @returns 
     */
    async addUsers(addUsers: AddUsers) {
        const method = `${this.contextClass} addUsers`;
        try {
            //Adds users
            let users = addUsers.pro_users as { use_code: string, use_name: string }[];
            if (users.length > 0) {
                let useCodes = users.map(user => user.use_code);
                let useCodeString = useCodes.join(',');
                const query2 = `
                SELECT sch_projects.fun_add_users_to_project($1, $2) AS add_result;`;
                const params2 = [useCodeString, addUsers.pro_code];
                const result2 = await this.uSql.makeQuery(query2, params2);
                if (!result2[0]["add_result"]) {
                    return {
                        result: 'fail',
                        message: "Couldn't add the users",
                    };
                }
            }
            return { result: "success", message: "Users has been added", data: addUsers.pro_users as any };
        } catch (error) {
            throw new InternalServerErrorException(`Error in ${method}: ${error}`);
        }
    }

}
