import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterUserDTO } from './dto/registerUserDTO.js';
import { loginUserDTO } from './dto/loginUserDTO.js';
import { Throttle } from '@nestjs/throttler';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth') //Auth Section of Swagger UI
@Controller('auth') 
export class AuthController {

    constructor(private authService: AuthService){}

    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @ApiOperation({ summary: 'Register a new user' })
    @Post('register') //http://localhost:3000/auth/register -> post request
    async registerUser(@Body() registerUserdto: RegisterUserDTO){
       const CreatedUser = await this.authService.registerService(registerUserdto);
       return CreatedUser   
    }

    // Only 5 attempts per minute!
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @ApiOperation({ summary: 'Login user' })
    @Post('login')  //http://localhost:3000/auth/login -> post request
    async loginUser(@Body() loginUserdto: loginUserDTO){
        const loginUser = await this.authService.loginService(loginUserdto);
        return loginUser
    }  
}
