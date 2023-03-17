import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
import { DomainsService } from '../services/domains.service';
// import { JwtAuthGuard } from '../../module-auth/jwt.auth.guard.service';

// @UseGuards(JwtAuthGuard)
@ApiTags('Domains services')
@Controller('domains')
export class DomainsController {

    constructor(private domainsService: DomainsService) { }

    @Get('/getAllCompanies')
    @ApiOperation({ summary: 'Gets all companies' })
    async getAllCompanies() {
        return this.domainsService.getAllCompanies();
    }
}
