import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { MessageDto } from '../dtos/message.dto';

@Injectable()
export class ChatgptService {

    constructor(
        private configService: ConfigService) { }

    contextClass = "ChatgptService - ";

    private readonly apiUrl = 'https://api.openai.com/v1/chat/completions';

    async sendMessage(message: MessageDto): Promise<any> {
        try {
            const response = await axios.post(
                this.apiUrl,
                {
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'user',
                            content: message.message,
                        },
                    ],
                    temperature: 0.7,
                    max_tokens: 100,
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.configService.get<string>('CHAT_KEY')}`,
                        'Content-Type': 'application/json',
                    },
                },
            );


            if (message.responseType == "complete")
                return response.data;
            else if (message.responseType == "message")
                return { result: "success", data: response.data.choices[0].message.content, message: "Chat gpt response" };
        } catch (error: any) {
            throw new HttpException('Failed to generate text', error.response.status);
        }
    }


}


