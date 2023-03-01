import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UtilitiesModule } from '../module-utilities/utilities.module';
import { LoginController } from './controllers/login.controller';
import { LoginService } from './services/login.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [HttpModule, UtilitiesModule, HttpModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>("JWT_SECRET_KEY"),
                signOptions: {
                    expiresIn: configService.get<string>("JWT_EXPIRATION")
                }
            }),
            inject: [ConfigService],
        }),
        PassportModule],
    providers: [LoginService],
    controllers: [LoginController]
})
export class AuthModule { }
