import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service.js';
import { RegisterUserDTO } from './dto/registerUserDTO.js';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(private userService: UserService){} 

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
        
        return this.userService.CreateUser({...registerUserdto, password:hashPassword});
    }
}
