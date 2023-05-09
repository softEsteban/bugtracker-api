import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class Message {
    @IsNotEmpty()
    @ApiProperty({ description: "The Chatgpt prompt to send" })
    message: string;

}
