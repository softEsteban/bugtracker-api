import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDateString, IsEmpty, IsNotEmpty, IsString } from "class-validator";

enum ProjectStatus {
    ANALYSIS = "Analysis",
    PROTOTYPING = "Prototyping",
    DEVELOPMENT = "Development",
    TESTING = "Testing",
    DEPLOYMENT = "Deployment",
    PRODUCTION = "Production",
}

interface User {
    use_code: string;
    use_name: string;
}

export class CreateProject {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "The projects's title" })
    pro_title: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "The projects's description" })
    pro_descri: string;

    @IsString()
    @ApiProperty({
        description: "The projects's status",
        enum: ProjectStatus,
        enumName: "ProjectStatus",
        default: ProjectStatus.DEVELOPMENT,
    })
    pro_status: ProjectStatus = ProjectStatus.DEVELOPMENT;

    @IsDateString()
    @ApiProperty({ description: "The projects's start date" })
    pro_datstart: Date;

    @IsDateString()
    @ApiProperty({ description: "The projects's end date" })
    pro_datend: Date;

    @IsArray()
    @IsNotEmpty()
    @ApiProperty({ description: "The projects's users array", example: [{ use_code: "string", use_name: "string" }], })
    pro_users: User[];

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "The projects's creator code" })
    use_code: string;

}
