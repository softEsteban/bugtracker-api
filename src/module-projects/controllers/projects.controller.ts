import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
import { ProjectsService } from '../services/projects.service';
import { AddUsers } from '../dtos/add.users.dto';
import { CreateProject } from '../dtos/create.project.dto';
// import { JwtAuthGuard } from '../../module-auth/jwt.auth.guard.service';

// @UseGuards(JwtAuthGuard)
@ApiTags('Projects services')
@Controller('projects')
export class ProjectsController {

    constructor(private projectsService: ProjectsService) { }

    @Get('/getAllProjects')
    @ApiOperation({ summary: 'Gets all projects' })
    async getAllProjects() {
        return this.projectsService.getAllProjects();
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
