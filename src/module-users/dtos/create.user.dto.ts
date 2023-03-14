import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

enum UserType {
    ADMIN = "Admin",
    USER = "User",
    DEVELOPER = "Developer",
}

export class CreateUser {
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
        description: "The user's type",
        enum: UserType,
        enumName: "UserType",
        default: UserType.USER,
    })
    use_type: UserType = UserType.USER;

    @ApiProperty({ description: "The URL to the user's profile picture" })
    use_pic: string;

    @ApiProperty({
        description: "The user's GitHub username",
        required: false,
    })
    use_github?: string;

    @IsNotEmpty()
    @ApiProperty({
        description: "The user's password",
        required: false,
    })
    use_pass?: string;

    @IsNotEmpty()
    @ApiProperty({
        description: "The user's profile configuration",
        required: false,
    })
    pro_code?: string;

    @IsNotEmpty()
    @ApiProperty({
        description: "The user's company or organization",
        required: false,
    })
    cop_code: string;
}
