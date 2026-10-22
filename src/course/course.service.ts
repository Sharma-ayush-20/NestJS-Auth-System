import {
  ForbiddenException,
  Injectable,
  Module,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';
import { Course, CourseDocument } from './schemas/course.schema.js';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/schemas/user.schema.js';
import { Role } from '../user/user.types.js';
import { ModuleDocument } from './schemas/module.schema.js';
import { CreateModuleDTO } from './dto/create-module.dto.js';
import { CreateLessonDTO } from './dto/create-lesson.dto.js';
import { QueryCourseDTO } from './dto/query-course.dto.js';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private coursemodel: Model<CourseDocument>,
    @InjectModel(User.name) private usermodel: Model<UserDocument>,
    @InjectModel(Module.name) private modulemodel: Model<ModuleDocument>,
  ) {}

  async create(
    createCourseDto: CreateCourseDto,
    user: { sub: string; role: Role },
  ) {
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

  async findAll(QueryCouresDto: QueryCourseDTO) {

    const { page = 1, limit = 5 } = QueryCouresDto || {};

    const skip = (page - 1) * limit;
    const total = await this.coursemodel.countDocuments();

    const allCourse = await this.coursemodel
      .find()
      .limit(limit)
      .skip(skip)
      .populate('instructorId', 'fname lname email');

    return {
      status: 200,
      message: 'Fetch Course Sucessfully!',
      meta: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit)
      },
      data: allCourse,
    };
  }

  async findOne(id: string) {
    const particularCourse = await this.coursemodel
      .findById(id)
      .populate('instructorId', 'fname lname email');
    if (!particularCourse) {
      throw new NotFoundException('Course not found');
    }
    return particularCourse;
  }

  async update(
    id: string,
    updateCourseDto: UpdateCourseDto,
    user: { sub: string; role: Role },
  ) {
    const course = await this.coursemodel.findById(id);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const isInstructor = course.instructorId.toString() === user.sub;
    const isAdmin = user.role === Role.ADMIN;

    if (!isInstructor && !isAdmin) {
      throw new ForbiddenException(
        "You don't have permission to update this course",
      );
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
      throw new ForbiddenException(
        "You don't have permission to delete this course",
      );
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

  async createModule(
    id: string,
    user: { sub: string; role: Role },
    createModuleDto: CreateModuleDTO,
  ) {
    const { name, description } = createModuleDto;

    const course = await this.coursemodel.findById(id);

    if (!course) {
      throw new NotFoundException('Course Not Found');
    }

    // Verify Teacher ownership OR Admin
    const isInstructor = course.instructorId.toString() === user.sub;

    const isAdmin = user.role === Role.ADMIN;
    if (!isInstructor && !isAdmin) {
      throw new ForbiddenException(
        "You don't have permission to create this module",
      );
    }

    // Push the module directly into course.modules
    course.modules.push({
      name, description, lessons: [],
    } as any)

    //Save the parent course document
    await course.save()

    return {
      status: 200,
      message: `${name} is created SucessFully`,
      data: course,
    };
  }

  async createLesson(courseId: string, moduleId: string, user: { sub: string; role: Role }, createLessonDto: CreateLessonDTO){
    const { name, videoUrl, duration, isFreePreview } = createLessonDto

    //find the course
    const course = await this.coursemodel.findById(courseId)

    if(!course){
      throw new NotFoundException('Course Not Found')
    }

    // Verify Teacher ownership OR Admin
    const isInstructor = course.instructorId.toString() === user.sub;
    const isAdmin = user.role === Role.ADMIN;

    if(!isInstructor && !isAdmin){
      throw new ForbiddenException("You don't have permission to create this lesson")
    }

    //find the target Module
    const targetModule = course.modules.find((module) => (module as any)._id.toString() === moduleId)

    if(!targetModule){
      throw new NotFoundException('Module not found');
    }

    // Push the lesson directly into targetModule.lessons
    targetModule.lessons.push({name, videoUrl, duration, isFreePreview} as any)
    //Save the parent course document
    await course.save()

    return {
      status: 200,
      message: `${name} is created SucessFully`,
      data: course,
    };
    
  } 
}
