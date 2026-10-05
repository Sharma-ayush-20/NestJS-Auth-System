import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { UserModule } from '../user/user.module.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({ 
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    ConfigModule.forRoot(),
    UserModule, 
    JwtModule.register({ 
    secret: process.env.JWT_SECRET,
    signOptions: {
      expiresIn: '1h',
    }
  })]
})
export class AuthModule {}
