import { Controller, Param, Post, Put, Get, Body, Delete } from '@nestjs/common';
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

    @Get('/getDevelopersSelect')
    @ApiOperation({ summary: 'Gets developer users for a select component' })
    async getDevelopersSelect() {
        return this.usersService.getDevelopersSelect();
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

    @Delete('/deleteUser/:userId')
    @ApiOperation({ summary: 'Deletes a user by user code' })
    async deleteUser(@Param('userId') userId: number) {
        return this.usersService.deleteUser(userId);
    }
}
