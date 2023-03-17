import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { UtilitiesModule } from '../module-utilities/utilities.module';
import { DomainsController } from './controllers/domains.controller';
import { DomainsService } from './services/domains.service';

@Module({
    imports: [HttpModule, UtilitiesModule],
    providers: [DomainsService],
    controllers: [DomainsController]
})
export class DomainsModule { }
