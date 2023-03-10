import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService, LoginDto } from '../services/auth.service';

@ApiTags('Login Service')
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
        @Body('use_email') use_email: string,
        @Body('use_pass') use_pass: string
    ) {
        return this.authService.register(use_email, use_pass);
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
