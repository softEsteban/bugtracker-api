import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChatgptService } from '../services/chatgpt.service';
import { MessageDto } from '../dtos/message.dto';

@ApiTags('Chat GPT Service')
@Controller('chatgpt')
export class ChatgptController {

    constructor(private chatgptService: ChatgptService) { }

    @Post('sendMessage')
    @ApiOperation({ summary: 'Sends a prompt to Chatgpt API' })
    async sendMessage(@Body() message: MessageDto) {
        return this.chatgptService.sendMessage(message);
    }
}
