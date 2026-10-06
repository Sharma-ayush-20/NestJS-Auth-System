import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterUserDTO } from './dto/registerUserDTO.js';
import { loginUserDTO } from './dto/loginUserDTO.js';

@Controller('auth') 
export class AuthController {

    constructor(private authService: AuthService){}

    @Post('register') //http://localhost:3000/auth/register -> post request
    async registerUser(@Body() registerUserdto: RegisterUserDTO){
       const CreatedUser = await this.authService.registerService(registerUserdto);
       return CreatedUser   
    }

    @Post('login')  //http://localhost:3000/auth/login -> post request
    async loginUser(@Body() loginUserdto: loginUserDTO){
        const loginUser = await this.authService.loginService(loginUserdto);
        return loginUser
    }  
}
