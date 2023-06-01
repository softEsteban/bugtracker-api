import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
import { DomainsService } from '../services/domains.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Domains services')
@Controller('domains')
export class DomainsController {

    constructor(private domainsService: DomainsService) { }

    @Get('/getAllCompanies')
    @ApiOperation({ summary: 'Gets all companies' })
    async getAllCompanies() {
        return this.domainsService.getAllCompanies();
    }

    @Get('/getDevelopersSelect')
    @ApiOperation({ summary: 'Gets all developers' })
    async getDevelopersSelect() {
        return this.domainsService.getDevelopersSelect();
    }
}
