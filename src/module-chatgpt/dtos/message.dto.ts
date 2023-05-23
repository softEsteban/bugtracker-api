import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export enum ResponseType {
    Complete = "complete",
    Message = "message",
}

export class MessageDto {
    @IsNotEmpty()
    @ApiProperty({ description: "The Chatgpt prompt to send" })
    message: string;

    @IsNotEmpty()
    @ApiProperty({ description: "The Chatgpt prompt to send", enum: ResponseType })
    responseType: ResponseType;

}
