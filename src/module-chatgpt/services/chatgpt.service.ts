import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ChatgptService {

    constructor(
        private configService: ConfigService) { }

    contextClass = "ChatgptService - ";

    private readonly apiUrl = 'https://api.openai.com/v1/chat/completions';

    async sendMessage(message: string): Promise<string> {
        try {
            const response = await axios.post(
                this.apiUrl,
                {
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'user',
                            content: message,
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
            return response.data;
        } catch (error: any) {
            throw new HttpException('Failed to generate text', error.response.status);
        }
    }


}


