import { Controller, Param, Post, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { ApiTags } from '@nestjs/swagger';
// import { JwtAuthGuard } from '../../module-auth/jwt.auth.guard.service';

// @UseGuards(JwtAuthGuard)
@ApiTags('Users services')
@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) { }

    @Post('/createUser')
    @ApiOperation({ summary: 'Creates a new user' })
    async registerUser() {
        return;
    }

    @Get('/getAllUsers')
    @ApiOperation({ summary: 'Get sall users' })
    async getAllUsers() {
        return this.usersService.getAllUsers();
    }
}
