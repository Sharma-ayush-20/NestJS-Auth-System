import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/schemas/user.schema.js';
import { Model, Types } from 'mongoose';
import { Course, CourseDocument } from '../course/schemas/course.schema.js';
import {
  Enrollment,
  EnrollmentDocument,
} from '../enrollment/schemas/enrollment.schema.js';
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

  private async updateCourseRatingStats(courseId: string) {

    //Run the aggregation pipeline
    const stats = await this.reviewModel.aggregate([
      {
        //Filter only reviews for this course
        $match: {
          courseId: new Types.ObjectId(courseId)
        },
      },
      {
        //Group and calculate average and count
        $group: {
          _id: `$courseId`,
          averageRating: { $avg: '$ratings' },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    //If reviews exist, update the Course with the stats
    if (stats.length > 0) {
      await this.courseModel.findByIdAndUpdate(courseId, {
        averageRating: Math.round(stats[0].averageRating * 10) / 10, // e.g., 4.6666 -> 4.7
        totalReviews: stats[0].totalReviews,
      });
    } else {
      // If no reviews left (e.g. all deleted), reset to defaults
      await this.courseModel.findByIdAndUpdate(courseId, {
        averageRating: 0,
        totalReviews: 0,
      });
    }
  }

  async reviewcourse(
    courseId: string,
    user: { sub: string; role: Role },
    reviewCourseDto: ReviewCourseDTO,
  ) {
    //find the course
    const course = await this.courseModel.findById(courseId);
    if (!course) {
      throw new NotFoundException('Course Not Found');
    }
    //find the student
    const student = await this.userModel.findById(user.sub);
    if (!student) {
      throw new NotFoundException('Student Not Found');
    }

    //find the student is enroll in this course
    const isEnrolled = await this.enrollmentModel.findOne({
      studentId: user.sub,
      courseId: courseId,
    });

    if (!isEnrolled) {
      throw new ForbiddenException(
        'You must be enrolled in this course to leave a review',
      );
    }

    //extracts the ratings and comment
    const { ratings, comment } = reviewCourseDto;

    const isAlreadyReview = await this.reviewModel.findOne({
      studentId: user.sub,
      courseId: courseId,
    });

    if (isAlreadyReview) {
      throw new ConflictException('You already review this course');
    }

    //create a new review for using this details
    const review = new this.reviewModel({
      studentId: new Types.ObjectId(user.sub),
      courseId: new Types.ObjectId(courseId),
      ratings,
      comment,
    });
    await review.save();

    // Automatically recalculate and sync course stats!
    await this.updateCourseRatingStats(courseId);

    return {
      status: 200,
      message: `${student.fname} review ${course.name} Course Successfully.`,
      data: review,
    };
  }
}
