import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UtilitiesModule } from '../module-utilities/utilities.module';
import { ProjectsController } from './controllers/projects.controller';
import { ProjectsService } from './services/projects.service';

@Module({
    imports: [HttpModule, UtilitiesModule],
    providers: [ProjectsService],
    controllers: [ProjectsController]
})
export class ProjectsModule { }
