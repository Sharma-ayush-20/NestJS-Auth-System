import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { EnrollmentService } from './enrollment.service.js';
import { AuthGuard } from '../auth/guards/auth.guards.js';
import { RolesGuard } from '../auth/guards/roles.guards.js';
import { Roles } from '../auth/decorators/roles.decorators.js';
import { Role } from '../user/user.types.js';
import { EnrollmentCourseDTO } from './dto/enrollment.course.dto.js';
import { ParseObjectIdPipe } from '../common/pipes/parse.object.id.js';

@Controller('enroll')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post('/:courseId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.STUDENT)
  enrollCourse(
    @Param('courseId', ParseObjectIdPipe) courseId: string,
    @Request() request: any,
  ) {
    return this.enrollmentService.enrollcourse(courseId, request.user);
  }

  @Get('my-courses')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.STUDENT)
  myCourses(@Request() request: any) {
    return this.enrollmentService.mycourses(request.user);
  }

  @Patch('/:courseId/lesson/:lessonId/complete')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.STUDENT)
  completeLesson(
    @Param('courseId', ParseObjectIdPipe) courseId: string,
    @Param('lessonId', ParseObjectIdPipe) lessonId: string,
    @Request() request: any,
  ) {
    return this.enrollmentService.completelesson(courseId, lessonId, request.user)
  }
}
