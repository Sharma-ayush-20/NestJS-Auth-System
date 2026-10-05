import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterUserDTO } from './dto/registerUserDTO.js';

//http://localhost:3000/auth/register -> post request
@Controller('auth') 
export class AuthController {

    constructor(private authService: AuthService){}

    @Post('register')
    async registerUser(@Body() registerUserdto: RegisterUserDTO){
       const CreatedUser = await this.authService.registerService(registerUserdto);
       return CreatedUser   
    }
}
