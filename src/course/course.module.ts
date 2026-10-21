import { Module } from '@nestjs/common';
import { CourseService } from './course.service.js';
import { CourseController } from './course.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './schemas/course.schema.js';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from '../user/schemas/user.schema.js';
import { ModuleSchema } from './schemas/module.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Course.name, schema: CourseSchema}, {name: User.name, schema: UserSchema}, {name: Module.name, schema: ModuleSchema}]),
    JwtModule
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
