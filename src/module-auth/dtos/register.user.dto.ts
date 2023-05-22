import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class RegisterUser {
    @IsNotEmpty()
    @ApiProperty({ description: "The user's first name" })
    use_name: string;

    @IsNotEmpty()
    @ApiProperty({ description: "The user's last name" })
    use_lastname: string;

    @IsNotEmpty()
    @ApiProperty({ description: "The user's email address" })
    use_email: string;

    @IsNotEmpty()
    @ApiProperty({
        description: "The user's password",
        required: false,
    })
    use_pass?: string;

    @IsNotEmpty()
    @ApiProperty({
        description: "The user's company or organization",
        required: false,
    })
    cop_code: string;
}
