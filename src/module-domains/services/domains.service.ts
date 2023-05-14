import { Injectable } from '@nestjs/common';
import { USQL } from 'src/module-utilities/usql';


@Injectable()
export class DomainsService {

    constructor(
        private uSql: USQL) {

    }

    contextClass = "DomainsService - ";

    async getAllCompanies() {
        const method = this.contextClass + "getAllCompanies";
        try {
            let companies = await this.uSql.makeQuery(`SELECT cop_code, cop_name FROM sch_domains.tb_company`, [])

            if (!companies.length) {
                return {
                    result: 'success',
                    message: "No companies were found",
                };
            }
            return { result: "success", data: companies, message: "All companies retrieved" };
        } catch (e) {
            console.log("Exception at: " + method);
        }
    }

    async getDevelopersSelect() {
        const method = this.contextClass + "getDevelopersSelect";
        try {
            let users = await this.uSql.makeQuery(`
            SELECT 
                    tuser.use_code, tuser.use_name
            FROM 
                    sch_generic.tb_user tuser
            WHERE
                    tuser.use_type = 'Developer'
            ORDER BY 
                    use_datins DESC`, [])

            if (!users.length) {
                return {
                    result: 'success',
                    message: "No users were found",
                };
            }

            return { result: "success", data: users, message: "All users retrieved" };
        } catch (e) {
            console.log("Exception at: " + method);

        }
    }

}
