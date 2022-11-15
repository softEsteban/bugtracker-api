import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { DUser } from './user.model';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) {

    }

    @Post('/createUser')
    @ApiOperation({ summary: 'Creates a new user' })
    async registerUser(@Body() duser: DUser) {
        return this.usersService.registerUser(duser);
    }

}
