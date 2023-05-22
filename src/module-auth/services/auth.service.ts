import { Injectable, NotFoundException } from '@nestjs/common';
import { URequest } from '../../module-utilities/urequest';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { USQL } from '../../module-utilities/usql';
import * as querystring from 'querystring';
import * as bcrypt from 'bcrypt';
import { IsNotEmpty, validate } from 'class-validator';
import { JWTPayload } from '../jwt.payload.interface';
import { UEmail } from 'src/module-utilities/uemail';
import { RegisterUser } from '../dtos/register.user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import User from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Response } from 'express';


export class LoginDto {
    @IsNotEmpty()
    use_email: string;

    @IsNotEmpty()
    use_pass: string;
}

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private configService: ConfigService,
        private uRequest: URequest,
        private uSql: USQL,
        private uEmail: UEmail,
        private jwtService: JwtService) { }

    contextClass = "AuthService - ";

    //ENV variables
    client_id = this.configService.get<string>('CLIENT_ID');
    client_secret = this.configService.get<string>('CLIENT_SECRET');
    confirm_url = this.configService.get<string>('CONFIRM_URL');
    login_url = this.configService.get<string>('LOGIN_URL');

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
                `SELECT tuser.use_code, tuser.use_name, tuser.use_lastname, 
                tuser.use_type, tuser.use_github, tuser.use_email,
                tpro.pro_config  
                FROM sch_generic.tb_user tuser, sch_generic.tb_profile tpro
                WHERE tuser.pro_code = tpro.pro_code 
                AND use_github = $1`,
                [user.login]
            );

            userGithub["use_pic"] = user.avatar_url;

            if (!userGithub.length) {
                return {
                    result: 'success',
                    message: "The given user isn't register in Mantis",
                };
            }

            //Adds token
            userGithub[0].token = this.generateToken(userGithub[0].use_email, userGithub[0].use_email);
            return {
                result: 'success',
                data: userGithub[0],
                message: 'User has login with Github',
            };
        } catch (e) {
            console.log("Exception at: getGithubToken")
        }
    }


    /**
     * 
     */
    async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    /**
     * 
     */
    async login(loginDto: LoginDto) {
        const method = this.contextClass + 'login';

        try {
            // Validate loginDto
            const errors = await validate(loginDto);
            if (errors.length > 0) {
                return {
                    result: 'fail',
                    message: 'Validation failed',
                    data: errors,
                };
            }

            // Get user by email
            const user = await this.uSql.makeQuery(
                `   SELECT tuser.use_code, tuser.use_name, tuser.use_lastname, tuser.confirmed_email,
                            tuser.use_type, tuser.use_github, tuser.use_email, tuser.use_pic, tuser.use_pass,
                            tpro.pro_config  
                    FROM sch_generic.tb_user tuser, 
                         sch_generic.tb_profile tpro
                    WHERE tuser.pro_code = tpro.pro_code 
                          AND use_email = $1`,
                [loginDto.use_email]
            );
            if (!user.length) {
                return {
                    result: 'success',
                    message: "The given user email doesn't exist",
                };
            }

            // Verifies if email is confirmed 
            if (user[0].confirmed_email == "unconfirmed") {
                return { result: 'success', message: "User email hasn't been confirmed!" };

            }

            // Compare password
            const match = await bcrypt.compare(loginDto.use_pass, user[0].use_pass);
            if (!match) {
                return { result: 'success', message: 'User password is incorrect' };
            }

            // Generate token
            user[0].token = this.generateToken(user[0].use_email, user[0].use_pass);
            delete user.use_pass;

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
     * 
     */
    async register(registerUser: RegisterUser) {
        const method = this.contextClass + 'register';

        try {
            // Performs input validation using class-validator decorators
            const errors = await validate(registerUser);
            if (errors.length > 0) {
                return { result: "success", message: "Some values are not correct or are missing", data: "" };
            }

            // Checks if user email already exists in the database
            const existingUserWithEmail = await this.userRepository.findOne({ where: { use_email: registerUser.use_email } });
            if (existingUserWithEmail) {
                return { result: "success", message: "A user with this email already exists", data: "" };
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(registerUser.use_pass, 10);

            // Creates a new user entity
            const newUser = this.userRepository.create({
                use_email: registerUser.use_email,
                use_pass: hashedPassword,
                use_name: registerUser.use_name,
                use_lastname: registerUser.use_lastname,
                use_type: 'User',
                use_datins: new Date(),
                use_datupd: new Date(),
                cop_code: registerUser.cop_code,
                pro_code: '3',
                confirmed_email: 'unconfirmed'
            });

            // Saves the user entity to the database
            const createdUser = await this.userRepository.save(newUser);

            //Send confirm email
            await this.uEmail.sendConfirmationEmail(registerUser.use_email, `${this.confirm_url}${(registerUser.use_email).replace("@", "%40")}`);

            //Generate token
            createdUser["token"] = this.generateToken(registerUser.use_email, hashedPassword);
            delete createdUser.use_pass;
            return {
                result: 'success',
                data: createdUser,
                message: 'User has been registered. Ready to be confirmed!',
            };
        } catch (error) {
            return {
                result: 'fail',
                message: `An error has occurred at: ${method} ${error}`,
            };
        }
    }

    /**
     * 
     * @param use_email 
     * @returns 
     */
    async confirmAccount(use_email: string, response: Response) {
        try {
            // Checks if user with given use_email exists in the database
            const existingUser = await this.userRepository.findOne({ where: { use_email: use_email } });
            if (!existingUser) {
                throw new NotFoundException(`User with email ${use_email} not found`);
            }

            //Sets to confirmed
            existingUser.confirmed_email = 'confirmed';
            await this.userRepository.save(existingUser);

            //Returns HTML
            response.send(`
            <style>
                h1 {
                    font-family: Arial, Helvetica, sans-serif;
                }
                a {
                    font-family: Verdana, Geneva, sans-serif;
                }
            </style>
            <h1>User has confirmed!</h1>
            <a href="${this.login_url}" target="_blank" >Login here</a>
            `);
        } catch (error) {
            //Returns HTML
            response.send('<h1>Internal server error</h1>');
        }
    }


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
            updatedUser[0].token = this.generateToken(use_email, hashedPassword);

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

    generateToken(use_email: string, use_pass: string) {
        const payload: JWTPayload = { use_email: use_email, use_pass: use_pass };
        return this.jwtService.sign(payload);
    }

}

