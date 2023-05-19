import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
import { ProjectsService } from '../services/projects.service';
import { AddUsers } from '../dtos/add.users.dto';
import { CreateProject } from '../dtos/create.project.dto';
import { AuthGuard } from '@nestjs/passport';

// @UseGuards(AuthGuard('jwt'))
@ApiTags('Projects services')
@Controller('projects')
export class ProjectsController {

    constructor(private projectsService: ProjectsService) { }

    @Get('/getAllProjects')
    @ApiOperation({ summary: 'Gets all projects' })
    async getAllProjects() {
        return this.projectsService.getAllProjects();
    }

    @Get('/getProjectsCountByUsers')
    @ApiOperation({ summary: 'Gets projects count by users' })
    async getProjectsCountByUsers() {
        return this.projectsService.getProjectsCountByUsers();
    }

    @Post('/createProject')
    @ApiOperation({ summary: 'Creates a new project' })
    async createProject(@Body() createProject: CreateProject) {
        return this.projectsService.createProject(createProject);
    }

    @Post('/addUsers')
    @ApiOperation({ summary: 'Adds users to a project' })
    async addUsers(@Body() addUsers: AddUsers) {
        return this.projectsService.addUsers(addUsers);
    }
}
