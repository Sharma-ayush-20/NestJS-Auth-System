import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service.js';
import { RegisterUserDTO } from './dto/registerUserDTO.js';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(private userService: UserService, private jwtService: JwtService){} 

    async registerService(registerUserdto : RegisterUserDTO){

        const {fname, lname, email, password} = registerUserdto;

        //Check validation
        if(!fname || !lname || !email || !password){
            return {
                status:400,
                message:"All fields are required"
            }
        }

        //check if user already exists
        const user = await this.userService.findByEmail(email);
        if(user){
            return {
                status:400,
                message:"User already exists. Sign In"
            }
        }

        //hash the password
        const hashPassword = await bcrypt.hash(password, 10);
        
        const response = await this.userService.CreateUser({...registerUserdto, password:hashPassword});

        const payload = { sub: response.data._id}
        const token = await this.jwtService.signAsync(payload)
        return {
            token: token,
            message: response.message,
            data: response.data
        }
    }
}
