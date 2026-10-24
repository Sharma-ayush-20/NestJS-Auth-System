import { Module } from '@nestjs/common';
import { EnrollmentController } from './enrollment.controller.js';
import { EnrollmentService } from './enrollment.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Enrollment, EnrollmentSchema } from './schemas/enrollment.schema.js';
import { JwtModule } from '@nestjs/jwt';
import { Course, CourseSchema } from '../course/schemas/course.schema.js';
import { User, UserSchema } from '../user/schemas/user.schema.js';
import { Lesson, LessonSchema } from '../course/schemas/lesson.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([ {name: Enrollment.name, schema: EnrollmentSchema}, 
      {name: Course.name, schema: CourseSchema}, {name: User.name, schema: UserSchema},
      {name: Lesson.name, schema: LessonSchema},
     ]),
    JwtModule,
  ],
  controllers: [EnrollmentController],
  providers: [EnrollmentService]
})
export class EnrollmentModule {}
