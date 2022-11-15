import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    last_name: { type: String, required: true },
    phone: { type: String, required: true },
    repository_url: { type: String, required: false },
    photo: { type: String, required: false }

})


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