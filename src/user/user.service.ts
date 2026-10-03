import { Injectable } from '@nestjs/common';
import { RegisterUserDTO } from '../auth/dto/registerUserDTO.js';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema.js';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from './user.types.js';

@Injectable()
export class UserService {

    constructor(@InjectModel(User.name) private usermodel: Model<UserDocument>,) {

    }

    //find user by email
    async findByEmail(email: string) {
        return await this.usermodel.findOne({ email })
    }

    //create a new user
    async CreateUser(registerUserDto: RegisterUserDTO) {
        const { fname, lname, password, email } = registerUserDto
        const user = new this.usermodel({
            fname,
            lname,
            email,
            password,
            role: Role.USER
        })
        await user.save();
        return {
            status: 201,
            message: "User Created Successfully!",
            data: user,
        }
    }

}
