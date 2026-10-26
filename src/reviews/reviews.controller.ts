import { Body, Controller, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service.js';
import { AuthGuard } from '../auth/guards/auth.guards.js';
import { RolesGuard } from '../auth/guards/roles.guards.js';
import { Roles } from '../auth/decorators/roles.decorators.js';
import { Role } from '../user/user.types.js';
import { ReviewCourseDTO } from './dto/review.dto.js';
import { ParseObjectIdPipe } from '../common/pipes/parse.object.id.js';

@Controller('reviews')
export class ReviewsController {

    constructor(private readonly reviewService: ReviewsService){}

    @Post('/:courseId')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.STUDENT)
    reviewCourse(@Param('courseId', ParseObjectIdPipe) courseId: string, @Request() request: any, @Body() reviewCourseDto: ReviewCourseDTO){
        return this.reviewService.reviewcourse(courseId, request.user, reviewCourseDto)
    }
}
