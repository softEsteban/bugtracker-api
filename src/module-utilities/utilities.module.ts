import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { URequest } from '../module-utilities/urequest';
import { USQL } from '../module-utilities/usql';
import { UEmail } from '../module-utilities/uemail';


@Module({
    imports: [HttpModule],
    providers: [URequest, USQL, UEmail],
    exports: [URequest, USQL, UEmail]
})
export class UtilitiesModule { }
