import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { HttpModule } from '@nestjs/axios';
import { UtilitiesModule } from '../module-utilities/utilities.module';
import { ProfilesService } from './services/profiles.service';
import { ProfilesController } from './controllers/profiles.controller';

@Module({
    imports: [HttpModule, UtilitiesModule],
    providers: [UsersService, ProfilesService],
    controllers: [UsersController, ProfilesController]
})
export class UsersModule { }
