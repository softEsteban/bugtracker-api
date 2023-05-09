import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UtilitiesModule } from '../module-utilities/utilities.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [HttpModule, UtilitiesModule,
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
    providers: [AuthService],
    controllers: [AuthController]
})
export class AuthModule { }
