import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { UserModule } from './user/user.module.js';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}), //nestjs can read this env files Globally
    AuthModule, 
    UserModule,
    MongooseModule.forRoot(process.env.MONGODB_URL as string), //use to connect the database Globally
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
