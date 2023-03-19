import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { validate } from 'class-validator';
import { CreateUser } from 'src/module-users/dtos/create.user.dto';
import { USQL } from 'src/module-utilities/usql';
import * as bcrypt from 'bcrypt';
import { UpdateUser } from '../dtos/update.user.dto';
import { create } from 'domain';


@Injectable()
export class UsersService {

    constructor(
        private uSql: USQL) {

    }

    contextClass = "UsersService - ";

    async getAllUsers() {
        const method = this.contextClass + "getAllUsers";
        try {
            let users = await this.uSql.makeQuery(`
            SELECT tuser.use_code, tuser.use_email, tuser.use_name, 
            tuser.use_lastname, tuser.use_type, tuser.use_pic, tuser.use_github,
            TO_CHAR(tuser.use_datins, 'DD Mon YYYY HH:mm PM') use_datfor,
            tuser.use_datins, tcop.cop_name
            FROM sch_generic.tb_user tuser,
            sch_domains.tb_company tcop
            WHERE tuser.cop_code = tcop.cop_code
            ORDER BY use_datins DESC`, [])

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

    async createUser(createUser: CreateUser) {
        const method = `${this.contextClass}.createUser`;

        try {
            // Perform input validation using class-validator decorators
            const errors = await validate(createUser);
            if (errors.length > 0) {
                return { result: "success", message: "Some values are not correct or are missing", data: "" };
            }

            // Check if user email or GitHub already exists in the database
            const existingUserWithEmail = await this.uSql.makeQuery(
                `SELECT use_code FROM sch_generic.tb_user WHERE use_email = $1`,
                [createUser.use_email]
            );

            if (existingUserWithEmail.length > 0) {
                return { result: "success", message: "A user with this email already exists", data: "" };
            }

            if (createUser.use_type == "Developer") {
                const existingUserWithGitHub = await this.uSql.makeQuery(
                    `SELECT use_code FROM sch_generic.tb_user WHERE use_github = $1`,
                    [createUser.use_github]
                );

                if (existingUserWithGitHub.length > 0) {
                    return { result: "success", message: "A user with this GitHub account already exists", data: "" };
                }
            }







            // Hash user password using bcrypt
            const hashedPassword = await bcrypt.hash(createUser.use_pass, 10);

            // Perform database insert and return created user
            const query = `
            INSERT INTO sch_generic.tb_user (use_email, use_name, use_type, use_pass, use_github, use_datins, pro_code, cop_code) 
            VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7)
            RETURNING use_code, use_email, use_name, use_type, use_github, pro_code, cop_code
            `;
            const params = [createUser.use_email, createUser.use_name, createUser.use_type, hashedPassword,
            createUser.use_github, createUser.pro_code, createUser.cop_code];
            const result = await this.uSql.makeQuery(query, params);
            const createdUser = result[0];

            return { result: "success", message: "User has been created", data: createdUser };
        } catch (error) {
            throw new InternalServerErrorException(`Error in ${method}: ${error}`);
        }
    }

    async updateUser(userId: number, updateUser: UpdateUser) {
        const method = `${this.contextClass}.updateUser`;

        try {
            // Perform input validation using class-validator decorators
            const errors = await validate(updateUser);
            if (errors.length > 0) {
                throw new BadRequestException(`Validation failed: ${errors}`);
            }

            // Check if user with given userId exists in the database
            const existingUser = await this.uSql.makeQuery(
                `SELECT use_code FROM sch_generic.tb_user WHERE use_code = $1`,
                [userId]
            );
            if (existingUser.length === 0) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }

            // Check if updated user email or GitHub already exists in the database
            const userWithEmailOrGithub = await this.uSql.makeQuery(
                `SELECT use_code FROM sch_generic.tb_user WHERE (use_email = $1 OR use_github = $2) AND use_code != $3`,
                [updateUser.use_email, updateUser.use_github, userId]
            );
            if (userWithEmailOrGithub.length > 0) {
                throw new ConflictException('User with same email or GitHub account already exists');
            }

            // Hash updated user password using bcrypt
            let hashedPassword;
            if (updateUser.use_pass) {
                hashedPassword = await bcrypt.hash(updateUser.use_pass, 10);
            }

            // Update user record in the database
            const setClauses = [];
            const params = [];
            if (updateUser.use_email) {
                setClauses.push(`use_email = $${setClauses.length + 1}`);
                params.push(updateUser.use_email);
            }
            if (updateUser.use_name) {
                setClauses.push(`use_name = $${setClauses.length + 1}`);
                params.push(updateUser.use_name);
            }
            if (updateUser.use_type) {
                setClauses.push(`use_type = $${setClauses.length + 1}`);
                params.push(updateUser.use_type);
            }
            if (hashedPassword) {
                setClauses.push(`use_pass = $${setClauses.length + 1}`);
                params.push(hashedPassword);
            }
            if (updateUser.use_github) {
                setClauses.push(`use_github = $${setClauses.length + 1}`);
                params.push(updateUser.use_github);
            }
            if (setClauses.length === 0) {
                throw new BadRequestException('At least one field to update must be provided');
            }
            params.push(userId);
            const query = `
                UPDATE sch_generic.tb_user
                SET ${setClauses.join(', ')}, use_datupd = NOW()
                WHERE use_code = $${params.length}
                RETURNING use_code, use_email, use_name, use_type, use_github
            `;
            const result = await this.uSql.makeQuery(query, params);
            const updatedUser = result[0];

            return updatedUser;
        } catch (error) {
            throw new InternalServerErrorException(`Error in ${method}: ${error}`);
        }
    }
}
