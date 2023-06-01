import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UtilitiesModule } from '../module-utilities/utilities.module';
import { ItemsController } from './controllers/items.controller';
import { ItemsService } from './services/items.service';
import { ProjectsController } from './controllers/projects.controller';
import { ProjectsService } from './services/projects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ItemDocument } from './entities/item.doc.entity';
import { Item } from './entities/item.entity';

@Module({
    imports: [HttpModule, UtilitiesModule, TypeOrmModule.forFeature([Project, Item, ItemDocument])],
    providers: [ProjectsService, ItemsService],
    controllers: [ProjectsController, ItemsController]
})
export class ProjectsModule { }
