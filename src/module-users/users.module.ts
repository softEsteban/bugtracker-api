import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { HttpModule } from '@nestjs/axios';
import { UtilitiesModule } from '../module-utilities/utilities.module';
import { ProfilesService } from './services/profiles.service';
import { ProfilesController } from './controllers/profiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './entities/user.entity';
import UserXProject from './entities/user.x.project.entity';
import Profile from './entities/profile.entity';
import Company from './entities/company.entity';

@Module({
    imports: [HttpModule, UtilitiesModule, TypeOrmModule.forFeature([User, UserXProject, Profile, Company])],
    providers: [UsersService, ProfilesService],
    controllers: [UsersController, ProfilesController]
})
export class UsersModule { }
