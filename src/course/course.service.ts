import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';
import { Course, CourseDocument } from './schemas/course.schema.js';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/schemas/user.schema.js';
import { Role } from '../user/user.types.js';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private coursemodel: Model<CourseDocument>,
    @InjectModel(User.name) private usermodel: Model<UserDocument>,
  ) {}

  async create(createCourseDto: CreateCourseDto, user: { sub: string; role: Role }) {
    const { name, description, level, price } = createCourseDto;

    const newCourse = new this.coursemodel({
      name,
      description,
      level,
      price,
      instructorId: user.sub,
    });
    await newCourse.save();

    return {
      status: 201,
      message: 'Course Created SuccessFully!',
      data: newCourse,
    };
  }

  async findAll() {
    const allCourse = await this.coursemodel.find().populate('instructorId', 'fname lname email');
    return allCourse;
  }

  async findOne(id: string) {
    const particularCourse = await this.coursemodel.findById(id).populate('instructorId', 'fname lname email');
    if (!particularCourse) {
      throw new NotFoundException('Course not found');
    }
    return particularCourse;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto, user: { sub: string; role: Role }) {
    const course = await this.coursemodel.findById(id);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const isInstructor = course.instructorId.toString() === user.sub;
    const isAdmin = user.role === Role.ADMIN;

    if (!isInstructor && !isAdmin) {
      throw new ForbiddenException("You don't have permission to update this course");
    }

    const updatedCourse = await this.coursemodel.findByIdAndUpdate(
      id,
      updateCourseDto,
      {
        returnDocument: 'after',
      },
    );
    if (!updatedCourse) {
      throw new NotFoundException('Course not found');
    }
    return {
      status: 200,
      message: 'Course updated Sucessfully!',
      data: updatedCourse,
    };
  }

  async remove(id: string, user: { sub: string; role: Role }) {
    const course = await this.coursemodel.findById(id);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const isInstructor = course.instructorId.toString() === user.sub;
    const isAdmin = user.role === Role.ADMIN;

    if (!isInstructor && !isAdmin) {
      throw new ForbiddenException("You don't have permission to delete this course");
    }

    const deletedCourse = await this.coursemodel.findByIdAndDelete(id, {
      returnDocument: 'after',
    });
    if (!deletedCourse) {
      throw new NotFoundException('Course not found');
    }
    return {
      status: 200,
      message: `${deletedCourse?.name} is deleted Successfully!`,
      data: deletedCourse,
    };
  }
}
