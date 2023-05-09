import { Module } from '@nestjs/common';
import { ChatgptService } from './services/chatgpt.service';
import { ChatgptController } from './controllers/chatgpt.controller';
import { HttpModule } from '@nestjs/axios';
import { UtilitiesModule } from '../module-utilities/utilities.module';

@Module({
    imports: [HttpModule],
    controllers: [ChatgptController],
    providers: [ChatgptService],
})
export class ChatgptModule { }
