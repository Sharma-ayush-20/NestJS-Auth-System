import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service.js';
import { RegisterUserDTO } from './dto/registerUserDTO.js';
import { loginUserDTO } from './dto/loginUserDTO.js';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(private userService: UserService, private jwtService: JwtService){} 

    //register the new user
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

    //login the user
    async loginService(loginUserdto : loginUserDTO){
        //authenticated part only
        const { email, password } = loginUserdto

        if(!email || !password){
            return {
                status: 401,
                message: "email and password is required."
            }
        }

        // email existed or not
        const existedEmail  = await this.userService.findByEmail(email)

        if(!existedEmail){
            return {
                status: 401,
                message: "Email not existed. please register yourself!"
            }
        }

        //password checking
        const isMatchPassword = await bcrypt.compare(password, existedEmail.password)

        if(!isMatchPassword){
            return {
                status: 401,
                message: "Password is not validate. please enter a correct password"
            }
        }

        //create a jwt token
        const payload = {sub: existedEmail._id}
        const token = await this.jwtService.signAsync(payload)

        const loginUser = await this.userService.loginUser(existedEmail);

        return {
            status: 200,
            message: "User login Successfully.",
            token: token,
            data: loginUser,
        }

    }

}
