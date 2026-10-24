import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Enrollment, EnrollmentDocument } from './schemas/enrollment.schema.js';
import { Model } from 'mongoose';
import { EnrollmentCourseDTO } from './dto/enrollment.course.dto.js';
import { Role } from '../user/user.types.js';
import { Course, CourseDocument } from '../course/schemas/course.schema.js';
import { User, UserDocument } from '../user/schemas/user.schema.js';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectModel(Enrollment.name)
    private enrollmentModel: Model<EnrollmentDocument>,
    @InjectModel(Course.name)
    private courseModel: Model<CourseDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async enrollcourse(courseId: string, user: { sub: string; role: Role }) {
    //find the course in the datbase
    const course = await this.courseModel.findById(courseId)
    if(!course){
      throw new NotFoundException("Course Not Found")
    }
    //find the student details
    const student = await this.userModel.findById(user.sub)
    if(!student){
      throw new NotFoundException("Student is invalid")
    }

    //check that student have already enroll in that course
    const alreadyEnrolled = await this.enrollmentModel.findOne({
      studentId: user.sub,
      courseId: courseId
    })

    if(alreadyEnrolled){
      throw new ConflictException('You are already enrolled in this course')
    }
    
    const enrollment = new this.enrollmentModel({
      studentId: user.sub,
      courseId: courseId,
    })
    await enrollment.save()

    return {
      status: 200,
      message: `${student.fname} enroll ${course.name} course successfully.`,
      data: enrollment
    }
  }

  async mycourses(user: { sub: string, role: Role }){
    const enrollCourse = await this.enrollmentModel.find({
      studentId: user.sub
    }).populate({
      path: 'courseId',
      populate: {
        path: 'instructorId',
        select: 'fname lname'
      } 
    })

    return {
      status: 200,
      message: "Your enrolled Courses",
      data: enrollCourse
    }
  }

}
