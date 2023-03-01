import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { HttpModule } from '@nestjs/axios';
import { UtilitiesModule } from '../module-utilities/utilities.module';

@Module({
    imports: [HttpModule, UtilitiesModule],
    providers: [UsersService],
    controllers: [UsersController]
})
export class UsersModule { }
