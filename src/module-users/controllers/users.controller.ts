import { Controller, Param, Post, Put, Get, Body } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUser } from '../dtos/create.user.dto';
import { UpdateUser } from '../dtos/update.user.dto';
// import { JwtAuthGuard } from '../../module-auth/jwt.auth.guard.service';

// @UseGuards(JwtAuthGuard)
@ApiTags('Users services')
@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) { }

    @Get('/getAllUsers')
    @ApiOperation({ summary: 'Gets all users' })
    async getAllUsers() {
        return this.usersService.getAllUsers();
    }

    @Get('/getAllDevelopersSelect')
    @ApiOperation({ summary: 'Gets all developer users for a select component' })
    async getAllDevelopersSelect() {
        return this.usersService.getAllDevelopersSelect();
    }

    @Post('/createUser')
    @ApiOperation({ summary: 'Creates a new user' })
    async createUser(@Body() createUser: CreateUser) {
        return this.usersService.createUser(createUser);
    }

    @Put('/updateUser/:userId')
    @ApiOperation({ summary: 'Updates a new user' })
    async updateUser(@Param('userId') userId: number, @Body() updateUser: UpdateUser) {
        return this.usersService.updateUser(userId, updateUser);
    }
}
