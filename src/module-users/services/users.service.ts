import { Injectable } from '@nestjs/common';
import { USQL } from 'src/module-utilities/usql';


@Injectable()
export class UsersService {

    constructor(
        private uSql: USQL) {

    }

    contextClass = "UsersService - ";

    async getAllUsers() {
        const method = this.contextClass + "getAllUsers";
        try {
            let result = this.uSql.makeQuery(`SELECT * FROM sch_generic.tb_user`, [])
            return { "result": "success", "data": result, "message": "All users retrieved" };
        } catch (e) {
            console.log("Exception at: " + method);

        }
    }

    async createUser() {
        const method = this.contextClass + "createUser";
        try {
            let result = this.uSql.makeQuery(`INSERT INTO sch_generic.tb_user (use_code, use_email,use_name,use_type,use_pass,use_github,use_datins) 
                                              VALUES ('1','estebantoro.greenman@gmail.com', 'Esteban', 'Developer', 'admin','softEsteban',NOW())`, [])
            return result;
        } catch (error) {
            return false;
        }
    }
}
