import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginService } from '../services/login.service';

@ApiTags('Login Service')
@Controller('auth')
export class LoginController {

    constructor(private loginService: LoginService) { }

    @Get('login/:use_email/:use_pass')
    @ApiOperation({ summary: 'Logins to Mantis' })
    login(@Param('use_email') use_email: string, @Param('use_pass') use_pass: string) {
        return this.loginService.login(use_email, use_pass);
    }

    @Get('getGithubToken/:code')
    @ApiOperation({ summary: 'Gets Github token authentication' })
    getGithubToken(@Param('code') code: string) {
        return this.loginService.getGithubToken(code);
    }
}
