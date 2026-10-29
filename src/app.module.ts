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
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { RedisModule } from './redis/redis.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), //nestjs can read this env files Globally

    // Configure rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds (1 minute window)
        limit: 20, // max 20 requests per minute
      },
    ]),

    AuthModule,
    UserModule,
    MongooseModule.forRoot(process.env.MONGODB_URL as string),
    CourseModule,
    EnrollmentModule,
    ReviewsModule, //use to connect the database Globally
    RedisModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Apply the rate limiter globally across all routes
    {
      provide: APP_GUARD, //register the global guard to use for all routes
      useClass: ThrottlerGuard, //use throttle guard for this
    },
  ],
})
export class AppModule {}
