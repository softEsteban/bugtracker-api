import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { validate } from 'class-validator';
import { CreateUser } from 'src/module-users/dtos/create.user.dto';
import { USQL } from 'src/module-utilities/usql';
import * as bcrypt from 'bcrypt';
import { UpdateUser } from '../dtos/update.user.dto';
import User from '../entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import UserXProject from '../entities/user.x.project.entity';



@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(UserXProject) private userXProjectRepository: Repository<UserXProject>,
        private uSql: USQL) {

    }

    contextClass = "UsersService - ";


    /**
     * 
     * @returns 
     */
    async getAllUsers() {
        const method = this.contextClass + "getAllUsers";
        try {
            let users = await this.uSql.makeQuery(`
            SELECT 
                    tuser.use_code, tuser.use_email, tuser.use_name, tuser.cop_code, 
                    tuser.pro_code, tuser.use_lastname, tuser.use_type, tuser.use_pic, tuser.use_github,
                    TO_CHAR(tuser.use_datins, 'DD Mon YYYY HH:mm PM') use_datfor,
                    tuser.use_datins, tcop.cop_name, tprof.pro_name,
                    COALESCE(sch_projects.fun_get_projects_by_user(tuser.use_code), '[]') AS use_projects
            FROM 
                    sch_generic.tb_user tuser,
                    sch_domains.tb_company tcop,
                    sch_generic.tb_profile tprof
            WHERE   
                    tuser.cop_code = tcop.cop_code AND
                    tuser.pro_code = tprof.pro_code
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

    /**
     * 
     * @param createUser 
     * @returns 
     */
    async createUser(createUser: CreateUser) {
        const method = `${this.contextClass}.createUser`;

        try {
            // Performs input validation using class-validator decorators
            const errors = await validate(createUser);
            if (errors.length > 0) {
                return { result: "success", message: "Some values are not correct or are missing", data: "" };
            }

            // Checks if user email already exists in the database
            const existingUserWithEmail = await this.userRepository.findOne({ where: { use_email: createUser.use_email } });
            if (existingUserWithEmail) {
                return { result: "success", message: "A user with this email already exists", data: "" };
            }

            // Checks if Github user already exists in the database
            if (createUser.use_type == "Developer") {
                const existingUserWithGitHub = await this.userRepository.findOne({ where: { use_github: createUser.use_github } });
                if (existingUserWithGitHub) {
                    return { result: "success", message: "A user with this GitHub account already exists", data: "" };
                }
            }

            // Hashes user password using bcrypt
            const hashedPassword = await bcrypt.hash(createUser.use_pass, 10);

            // Creates a new user entity
            const newUser = this.userRepository.create({
                use_email: createUser.use_email,
                use_name: createUser.use_name,
                use_lastname: createUser.use_lastname,
                use_type: createUser.use_type,
                use_pass: hashedPassword,
                use_github: createUser.use_github,
                use_datins: new Date(),
                use_datupd: new Date(),
                pro_code: createUser.pro_code,
                cop_code: createUser.cop_code,
            });

            // Saves the user entity to the database
            const createdUser = await this.userRepository.save(newUser);

            return { result: "success", message: "User has been created", data: createdUser };
        } catch (error) {
            throw new InternalServerErrorException(`Error in ${method}: ${error}`);
        }
    }

    /**
     * 
     * @param userId 
     * @param updateUser 
     * @returns 
     */
    async updateUser(userId: number, updateUser: UpdateUser) {
        const method = `${this.contextClass}.updateUser`;

        try {
            // Performs input validation using class-validator decorators
            const errors = await validate(updateUser);
            if (errors.length > 0) {
                throw new BadRequestException(`Validation failed: ${errors}`);
            }

            // Checks if user with given userId exists in the database
            const existingUser = await this.userRepository.findOne({ where: { use_code: userId } });
            if (!existingUser) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }

            // Updates user record in the database
            if (updateUser.use_email) {
                existingUser.use_email = updateUser.use_email;
            }
            if (updateUser.use_name) {
                existingUser.use_name = updateUser.use_name;
            }
            if (updateUser.use_lastname) {
                existingUser.use_lastname = updateUser.use_lastname;
            }
            if (updateUser.use_type) {
                existingUser.use_type = updateUser.use_type;
            }
            if (updateUser.pro_code) {
                existingUser.pro_code = updateUser.pro_code;
            }
            if (updateUser.cop_code) {
                existingUser.cop_code = updateUser.cop_code;
            }
            if (updateUser.use_github) {
                existingUser.use_github = updateUser.use_github;
            }
            existingUser.use_datupd = new Date();

            const updatedUser = await this.userRepository.save(existingUser);

            return { result: "success", message: "User has been updated!", data: updatedUser };
        } catch (error) {
            throw new InternalServerErrorException(`Error in ${method}: ${error}`);
        }
    }

    /**
     * 
     * @param userId 
     * @returns 
     */
    async deleteUser(userId: number) {
        const method = `${this.contextClass}.deleteUser`;

        try {
            // Checks if user with given userId exists in the database
            const existingUser = await this.userRepository.findOne({ where: { use_code: userId } });
            if (!existingUser) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }

            // Checks if user has projects related to it
            const projectCount = await this.userXProjectRepository
                .createQueryBuilder('userXProject')
                .where('userXProject.use_code = :userId', { userId })
                .getCount();
            if (projectCount > 0) {
                return { result: "error", message: "User has projects related!", data: [] };
            }

            // Deletes user record from the database
            await this.userRepository.delete(userId);

            return { result: "success", message: "User has been deleted!", data: existingUser };
        } catch (error) {
            throw new InternalServerErrorException(`Error in ${method}: ${error}`);
        }
    }
}
