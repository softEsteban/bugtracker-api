import { ApiProperty } from '@nestjs/swagger';

export interface User {

    code: String;
    country_code: String;
    email: String;
    password: String;
    name: String;
    last_name: String;
    phone: String;
    repository_url: String;
    photo: String;

}


export class DUser {

    @ApiProperty()
    code: String;
    @ApiProperty()
    id: String;
    @ApiProperty()
    email: String;
    @ApiProperty()
    password: String;
    @ApiProperty()
    name: String;
    @ApiProperty()
    last_name: String;
    @ApiProperty()
    phone: String;
    @ApiProperty()
    repository_url: String;
    @ApiProperty()
    photo: String;
}