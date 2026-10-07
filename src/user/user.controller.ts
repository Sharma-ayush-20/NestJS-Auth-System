import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guards.js';
import { UserService } from './user.service.js';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    //build a get profile user route
    @Get('profile') //http://localhost:3000/user/profile - Get
    @UseGuards(AuthGuard)
    async getProfile(@Request() request: any){
        const user = await this.userService.getUser(request.userId)
        return user
    }
}
