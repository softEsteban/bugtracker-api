import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString } from "class-validator";

interface User {
    use_code: string;
    use_name: string;
}

export class AddUsers {
    constructor(pro_code: string, pro_users: User[]) {
        this.pro_code = pro_code;
        this.pro_users = pro_users;
    }

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "The projects's code" })
    pro_code: string;

    @IsArray()
    @IsNotEmpty()
    @ApiProperty({ description: "The projects's users array", example: [{ use_code: "string", use_name: "string" }], })
    pro_users: User[];
}
