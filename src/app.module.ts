import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { UserModule } from './user/user.module.js';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CourseModule } from './course/course.module.js';
import { EnrollmentModule } from './enrollment/enrollment.module.js';
import { ReviewsModule } from './reviews/reviews.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}), //nestjs can read this env files Globally
    AuthModule, 
    UserModule,
    MongooseModule.forRoot(process.env.MONGODB_URL as string),
    CourseModule,
    EnrollmentModule,
    ReviewsModule, //use to connect the database Globally
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
