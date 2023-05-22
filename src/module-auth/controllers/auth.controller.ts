import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService, LoginDto } from '../services/auth.service';
import { RegisterUser } from '../dtos/register.user.dto';
import { Response } from 'express';
import { Res } from '@nestjs/common';


@ApiTags('Authentication Service')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('login/')
    @ApiOperation({ summary: 'Logins with Mantis' })
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Get('loginWithGithub/:code')
    @ApiOperation({ summary: 'Logins with Github' })
    loginWithGithub(@Param('code') code: string) {
        return this.authService.loginWithGithub(code);
    }

    @Post('register')
    @ApiOperation({ summary: 'Registers a new user' })
    async register(
        @Body() registerUser: RegisterUser
    ) {
        return this.authService.register(registerUser);
    }

    @Get('confirmAccount')
    @ApiOperation({ summary: 'Confirms the email of a new user' })
    async confirmAccount(
        @Query('email') use_email: string, @Res() response: Response
    ) {
        return this.authService.confirmAccount(use_email, response);
    }

    @Put('changePassword')
    @ApiOperation({ summary: 'Changes the password of an existing user' })
    async changePassword(
        @Body('use_email') use_email: string,
        @Body('old_pass') old_pass: string,
        @Body('new_pass') new_pass: string
    ) {
        return this.authService.changePassword(use_email, old_pass, new_pass);
    }
}
