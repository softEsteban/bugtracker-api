import { Injectable } from '@nestjs/common';
import { URequest } from '../../module-utilities/urequest';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { USQL } from '../../module-utilities/usql';

@Injectable()
export class LoginService {

    constructor(
        private configService: ConfigService,
        private uRequest: URequest,
        private uSql: USQL,
        private jwtService: JwtService) { }

    contextClass = "LoginService - ";

    //ENV variables
    client_id = this.configService.get<string>('CLIENT_ID');
    client_secret = this.configService.get<string>('CLIENT_SECRET');

    /**
     * Gets the token for a user that has login with Github
     * @param code Code returned in the github frontend
     * @returns The token
     * @author Esteban Toro
     */
    async getGithubToken(code: string) {
        try {
            const obj = {
                "client_id": this.client_id,
                "client_secret": this.client_secret,
                "code": code
            }
            let result = await this.uRequest.makeRequest("https://github.com/login/oauth/access_token", 'post', obj)
            return result;
        } catch (e) {
            console.log("Exception at: getGithubToken")
        }
    }


    /**
     *
     * @param code Code returned in the github frontend
     * @returns The token
     * @author Esteban Toro
     */
    async login(use_email: string, use_pass: string) {
        const method = this.contextClass + "login";
        try {
            let result = this.uSql.makeQuery(`SELECT use_code,use_email,use_pass FROM sch_generic.tb_user WHERE use_gmail = '?'`, [use_email])
            return result;
        } catch (error) {
            return false;
        }
    }

    /**
     * Generates a JWT token if the user logs in
     * @param use_code User id to pass as payload
     * @returns the sign action which generates the token
     * @author Esteban Toro
     */
    async generateToken(use_code: string) {
        const payload: JWTPayload = { use_code: use_code };
        return this.jwtService.sign(payload);
    }

}

export interface JWTPayload {
    use_code: string;
}
