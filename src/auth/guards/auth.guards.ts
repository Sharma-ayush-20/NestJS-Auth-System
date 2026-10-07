import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor (private readonly jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest()

        //get authorization headers
        const authHeader = request.headers.authorization;

        //check token exists
        if(!authHeader){
            throw new UnauthorizedException("Authorization token is required.")
        }

        //checks bearer format
        const [type, token] = authHeader.split(' ')

        if(type !== 'Bearer' || !token){
            throw new UnauthorizedException('Invalid authorization format')
        }

        //verify jwt token
        try {
            const payload = this.jwtService.verify(token, {secret : process.env.JWT_SECRET})
               
            // Store decoded user information in request
            request.userId = payload.sub;

            return true
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
