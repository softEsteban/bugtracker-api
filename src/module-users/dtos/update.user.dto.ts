import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsEmail, IsEnum } from "class-validator";

enum UserType {
    ADMIN = "Admin",
    USER = "User",
    DEVELOPER = "Developer",
}

export class UpdateUser {
    @IsString()
    @IsOptional()
    @ApiProperty({ description: "The user's first name" })
    use_name?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "The user's last name" })
    use_lastname?: string;

    @IsEmail()
    @IsOptional()
    @ApiProperty({ description: "The user's email address" })
    use_email?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "The user's GitHub username" })
    use_github?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "The user's password" })
    use_pass?: string;


    @IsEnum(UserType)
    @IsOptional()
    @ApiProperty({
        description: "The user's type",
        enum: UserType,
        enumName: "UserType",
        default: UserType.USER,
    })
    use_type?: UserType;

    @IsEnum(UserType)
    @IsOptional()
    @ApiProperty({
        description: "The user's profile config",
    })
    pro_code?: string;
}
