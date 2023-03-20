import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
import { ProjectCreate } from '../dtos/create.project.dto';
import { ProjectsService } from '../services/projects.service';
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
    async createProject(@Body() createProject: ProjectCreate) {
        return this.projectsService.createProject(createProject);
    }
}
