import { Injectable } from '@nestjs/common';
import { URequest } from '../../module-utilities/urequest';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { USQL } from '../../module-utilities/usql';
import * as querystring from 'querystring';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        private configService: ConfigService,
        private uRequest: URequest,
        private uSql: USQL,
        private jwtService: JwtService) { }

    contextClass = "AuthService - ";

    //ENV variables
    client_id = this.configService.get<string>('CLIENT_ID');
    client_secret = this.configService.get<string>('CLIENT_SECRET');

    /**
     * Gets the token for a user that has login with Github
     * @param code Code returned in the github frontend
     * @returns The token
     * @author Esteban Toro
     */
    async loginWithGithub(code: string) {
        const method = this.contextClass + 'loginWithGithub';

        try {
            const obj = {
                client_id: this.client_id,
                client_secret: this.client_secret,
                code: code
            }
            let result = await this.uRequest.makeRequest("https://github.com/login/oauth/access_token", 'post', obj)
            let jsonRes = querystring.parse(result);

            if (!jsonRes.access_token) {
                return {
                    result: 'fail',
                    message: `Couldn't get the token`,
                };
            }

            // Gets Github user data
            let userData = await this.uRequest.makeRequest("https://api.github.com/user", "get", "", { "Authorization": `token ${jsonRes.access_token}` });
            let userEmails = await this.uRequest.makeRequest("https://api.github.com/user/emails", "get", "", { "Authorization": `token ${jsonRes.access_token}` });

            let email = userEmails[1]["email"];
            let user = {
                github_id: userData.id,
                github_token: jsonRes.access_token,
                login: userData.login,
                avatar_url: userData.avatar_url,
                name: userData.name,
                email: email
            }

            //Validates if github login is in database
            const userGithub = await this.uSql.makeQuery(
                `SELECT tuser.use_code, tuser.use_email, tuser.use_pass, tpro.pro_config 
                FROM sch_generic.tb_user tuser, sch_generic.tb_profile tpro
                WHERE tuser.pro_code = tpro.pro_code 
                AND use_github = $1`,
                [user.login]
            );

            if (!userGithub.length) {
                return {
                    result: 'success',
                    message: "The given user isn't register in Mantis",
                };
            }

            //Adds token
            userGithub[0].token = this.generateToken(userGithub[0].use_email);
            return {
                result: 'success',
                data: userGithub[0],
                message: 'User has login with Github',
            };
        } catch (e) {
            console.log("Exception at: getGithubToken")
        }
    }

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    /**
     * Logins 
     * @param use_email user_email
     * @param use_pass user password
     * @returns The generated token
     * @author Esteban Toro
     */
    async login(use_email: string, use_pass: string) {
        const method = this.contextClass + 'login';

        try {
            // Get user by email
            const user = await this.uSql.makeQuery(
                `SELECT tuser.use_code, tuser.use_email, tuser.use_pass, tpro.pro_config 
                FROM sch_generic.tb_user tuser, sch_generic.tb_profile tpro
                WHERE tuser.pro_code = tpro.pro_code 
                AND use_email = $1`,
                [use_email]
            );

            if (!user.length) {
                return {
                    result: 'success',
                    message: "The given user email doesn't exist",
                };
            }

            // Compare password
            const match = await bcrypt.compare(use_pass, user[0].use_pass);
            if (!match) {
                return { result: 'success', message: 'User password is incorrect' };
            }

            // Generate token
            user[0].token = this.generateToken(user[0].use_code);

            return {
                result: 'success',
                data: user,
                message: 'User has login',
            };
        } catch (error) {
            return {
                result: 'fail',
                message: `An error has occurred at: ${method} ${error}`,
            };
        }
    }

    /**
     * Registers a new user 
     * @param 
     * @returns The generated token
     * @author Esteban Toro
     */
    async register(use_email: string, use_pass: string) {
        const method = this.contextClass + 'register';

        try {
            // Check if user already exists
            const existingUser = await this.uSql.makeQuery(
                `SELECT use_code, use_email, use_pass FROM sch_generic.tb_user WHERE use_email = $1`,
                [use_email]
            );

            if (existingUser.length) {
                return {
                    result: 'success',
                    message: 'User already exists',
                };
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(use_pass, 10);

            // Insert new user into database
            const newUser = await this.uSql.makeQuery(
                `INSERT INTO sch_generic.tb_user (use_email, use_pass) VALUES ($1, $2) RETURNING use_code, use_email`,
                [use_email, hashedPassword]
            );

            // Generate token
            newUser[0].token = this.generateToken('use_code');

            return {
                result: 'success',
                data: newUser,
                message: 'User has been registered',
            };
        } catch (error) {
            return {
                result: 'fail',
                message: `An error has occurred at: ${method} ${error}`,
            };
        }
    }

    /**
     * Changes login password 
     * @param 
     * @returns The generated token
     * @author Esteban Toro
     */
    async changePassword(use_email: string, old_pass: string, new_pass: string) {
        const method = this.contextClass + 'changePassword';

        try {
            // Get user by email
            const user = await this.uSql.makeQuery(
                `SELECT use_code, use_email, use_pass FROM sch_generic.tb_user WHERE use_email = $1`,
                [use_email]
            );

            if (!user.length) {
                return {
                    result: 'success',
                    message: "The given user email doesn't exist",
                };
            }

            // Compare old password
            const match = await bcrypt.compare(old_pass, user[0].use_pass);
            if (!match) {
                return { result: 'success', message: 'Old password is incorrect' };
            }

            // Hash new password
            const hashedPassword = await bcrypt.hash(new_pass, 10);

            // Update user password in database
            const updatedUser = await this.uSql.makeQuery(
                `UPDATE sch_generic.tb_user SET use_pass = $1 WHERE use_email = $2 RETURNING use_code, use_email`,
                [hashedPassword, use_email]
            );

            // Generate new token
            updatedUser[0].token = this.generateToken(use_email);

            return {
                result: 'success',
                data: updatedUser,
                message: 'User password has been changed',
            };
        } catch (error) {
            return {
                result: 'fail',
                message: `An error has occurred at: ${method} ${error}`,
            };
        }
    }

    /**
     * Generates a JWT token if the user logs in
     * @param use_code User id to pass as payload
     * @returns the sign action which generates the token
     * @author Esteban Toro
     */
    generateToken(use_code: string) {
        const payload: JWTPayload = { use_code: use_code };
        return this.jwtService.sign(payload);
    }

}

export interface JWTPayload {
    use_code: string;
}
