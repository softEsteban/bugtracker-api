import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DUser, User } from './user.model';
import { Model } from 'mongoose';
@Injectable()
export class UsersService {

    constructor(@InjectModel('User') private readonly userModel: Model<DUser>) {

    }

    /**
     * 
     */
    async registerUser(dUser: DUser) {
        const user = new this.userModel({
            email: dUser.email,
            name: dUser.name,
            last_name: dUser.last_name,
            password: dUser.password,
            phone: dUser.phone,
            photo: dUser.photo
        })
        const result = await user.save();
        console.log(result)
        return result;

    }
}
