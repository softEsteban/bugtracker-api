import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
import { ItemsService } from '../services/items.service';
// import { JwtAuthGuard } from '../../module-auth/jwt.auth.guard.service';

// @UseGuards(JwtAuthGuard)
@ApiTags('Items services')
@Controller('items')
export class ItemsController {

    constructor(private itemsService: ItemsService) { }

    @Get('/getAllTicketsByProject/:projectId')
    @ApiOperation({ summary: 'Gets all tickets by project' })
    async getAllTicketsByProject(@Param('projectId') projectId: string) {
        return this.itemsService.getAllTicketsByProject(projectId);
    }

    @Get('/getAllIssuesByProject/:projectId')
    @ApiOperation({ summary: 'Gets all issues by project' })
    async getAllIssuesByProject(@Param('projectId') projectId: string) {
        return this.itemsService.getAllIssuesByProject(projectId);
    }


}
