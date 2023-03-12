import { Injectable } from '@nestjs/common';
import { USQL } from 'src/module-utilities/usql';


@Injectable()
export class ProfilesService {

    constructor(
        private uSql: USQL) {

    }

    contextClass = "ProfilesService - ";

    async getAllProfiles() {
        const method = this.contextClass + "getAllProfiles";
        try {
            let profiles = await this.uSql.makeQuery(`SELECT pro_code, pro_name, string_agg(elem->>'title', ', ') profiles
                                                      FROM sch_generic.tb_profile, jsonb_array_elements(pro_config) elem
                                                      GROUP BY 1`, [])

            if (!profiles.length) {
                return {
                    result: 'success',
                    message: "No profiles were found",
                };
            }
            return { result: "success", data: profiles, message: "All profiles retrieved" };
        } catch (e) {
            console.log("Exception at: " + method);
        }
    }

}
