import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/schemas/user.schema.js';
import { Model } from 'mongoose';
import { Course, CourseDocument } from '../course/schemas/course.schema.js';
import { Enrollment, EnrollmentDocument } from '../enrollment/schemas/enrollment.schema.js';
import { Review, ReviewDocument } from './schemas/review.schema.js';
import { Role } from '../user/user.types.js';
import { ReviewCourseDTO } from './dto/review.dto.js';

@Injectable()
export class ReviewsService {

    constructor(
        @InjectModel(Enrollment.name)
        private enrollmentModel: Model<EnrollmentDocument>,
        @InjectModel(Course.name)
        private courseModel: Model<CourseDocument>,
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,
        @InjectModel(Review.name)
        private reviewModel: Model<ReviewDocument>,
      ) {}

      async reviewcourse(courseId: string, user: {sub: string, role: Role}, reviewCourseDto: ReviewCourseDTO) {
        //find the course
        const course = await this.courseModel.findById(courseId)
        if(!course){
            throw new NotFoundException("Course Not Found")
        }
        //find the student
        const student = await this.userModel.findById(user.sub)
        if(!student){
            throw new NotFoundException("Student Not Found")
        }

        //find the student is enroll in this course
        const isEnrolled  = await this.enrollmentModel.findOne({
            studentId: user.sub,
            courseId: courseId,
        })

        if(!isEnrolled){
            throw new ForbiddenException('You must be enrolled in this course to leave a review')
        }

        //extracts the ratings and comment
        const { ratings, comment } = reviewCourseDto

        const isAlreadyReview = await this.reviewModel.findOne({
            studentId: user.sub,
            courseId: courseId
        })

        if(isAlreadyReview){
            throw new ConflictException("You already review this course")
        }

        //create a new review for using this details
        const review = new this.reviewModel(
            {
                studentId: user.sub,
                courseId,
                ratings,
                comment
            }
        )
        await review.save()

        return {
            status: 200,
            message: `${student.fname} review ${course.name} Course Successfully.`,
            data: review
        }
      }
}
