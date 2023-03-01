import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { URequest } from '../module-utilities/urequest';
import { USQL } from '../module-utilities/usql';

@Module({
    imports: [HttpModule],
    providers: [URequest, USQL],
    exports: [URequest, USQL]
})
export class UtilitiesModule { }
