import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Enrollment, EnrollmentDocument } from './schemas/enrollment.schema.js';
import { Model } from 'mongoose';
import { EnrollmentCourseDTO } from './dto/enrollment.course.dto.js';
import { Role } from '../user/user.types.js';
import { Course, CourseDocument } from '../course/schemas/course.schema.js';
import { User, UserDocument } from '../user/schemas/user.schema.js';
import { Lesson, LessonDocument } from '../course/schemas/lesson.schema.js';
import { EnrollmentStatus } from './types/enrollment.status.type.js';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectModel(Enrollment.name)
    private enrollmentModel: Model<EnrollmentDocument>,
    @InjectModel(Course.name)
    private courseModel: Model<CourseDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(Lesson.name)
    private lessonModel: Model<LessonDocument>,
  ) {}

  async enrollcourse(courseId: string, user: { sub: string; role: Role }) {
    //find the course in the datbase
    const course = await this.courseModel.findById(courseId);
    if (!course) {
      throw new NotFoundException('Course Not Found');
    }
    //find the student details
    const student = await this.userModel.findById(user.sub);
    if (!student) {
      throw new NotFoundException('Student is invalid');
    }

    //check that student have already enroll in that course
    const alreadyEnrolled = await this.enrollmentModel.findOne({
      studentId: user.sub,
      courseId: courseId,
    });

    if (alreadyEnrolled) {
      throw new ConflictException('You are already enrolled in this course');
    }

    const enrollment = new this.enrollmentModel({
      studentId: user.sub,
      courseId: courseId,
    });
    await enrollment.save();

    return {
      status: 200,
      message: `${student.fname} enroll ${course.name} course successfully.`,
      data: enrollment,
    };
  }

  async mycourses(user: { sub: string; role: Role }) {
    const enrollCourse = await this.enrollmentModel
      .find({
        studentId: user.sub,
      })
      .populate({
        path: 'courseId',
        populate: {
          path: 'instructorId',
          select: 'fname lname',
        },
      });

    return {
      status: 200,
      message: 'Your enrolled Courses',
      data: enrollCourse,
    };
  }

  async completelesson(
    courseId: string,
    lessonId: string,
    user: { sub: string; role: Role },
  ) {

    //find the course
    const course = await this.courseModel.findById(courseId);
    if (!course) {
      throw new NotFoundException('Course Not Found');
    }

    //Find the lesson from inside the course's modules:
    let foundLesson = null;

    for (const module of course.modules) {
      const lesson = module.lessons.find(
        (l) => (l as any)._id.toString() === lessonId,
      );
      if (lesson) {
        foundLesson = lesson;
        break;
      }
    }

    if (!foundLesson) {
      throw new NotFoundException('Lesson not found in this course');
    }

    // find the enrollment
    const enrollment = await this.enrollmentModel.findOne({
      studentId: user.sub,
      courseId: courseId,
    });

    if (!enrollment) {
      throw new NotFoundException('You are not enrolled in this course');
    }

    // Prevent Duplicate Completions (Idempotency)
    const isAlreadyCompleted = enrollment.completedLessons.some(
      (id) => id.toString() === lessonId,
    );

    if(!isAlreadyCompleted){
      enrollment.completedLessons.push((foundLesson as any)._id)
    }

    // Calculate Total Lessons
    let totalLessons = 0;
    for(let module of course.modules){
      totalLessons = totalLessons + module.lessons.length
    }

    // Progress Percentage (%)
    const progressPercentage = Math.round(
      (enrollment.completedLessons.length / totalLessons) * 100
    )

    //update in enrollment
    enrollment.progress = progressPercentage

    // Did they reach 100%? Mark as COMPLETED!
    if(enrollment.progress === 100){
      enrollment.status = EnrollmentStatus.COMPLETED
      enrollment.completedAt = new Date();
    }

    //save the updated Document
    await enrollment.save();

    return {
      status: 200,
      message: `Lesson "${foundLesson.name}" marked as completed!`,
      data: {
        progress: enrollment.progress,
        completedLessons: enrollment.completedLessons.length,
        totalLessons,
        status: enrollment.status,
      },
    };

  }
}
