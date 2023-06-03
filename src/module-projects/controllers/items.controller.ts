import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
import { ItemsService } from '../services/items.service';
import { CreateItem } from '../dtos/create.item.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateItemDoc } from '../dtos/create.item.doc.dto';

// @UseGuards(AuthGuard('jwt'))
@ApiTags('Items services')
@Controller('items')
export class ItemsController {

    constructor(private itemsService: ItemsService) { }

    @Get('/getItemsCountByType')
    @ApiOperation({ summary: 'Gets items count by type' })
    async getItemsCountByType() {
        return this.itemsService.getItemsCountByType();
    }

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

    @Post('/createItem')
    @ApiOperation({ summary: 'Creates a new ticket or issue' })
    async createItem(@Body() createItem: CreateItem) {
        return this.itemsService.createItem(createItem);
    }

    @Post('/createItemDocument')
    @ApiOperation({ summary: 'Creates a new ticket or issue' })
    async createItemDocument(@Body() createItemDoc: CreateItemDoc) {
        return this.itemsService.createItemDocument(createItemDoc);
    }

}
