import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';
import { Course, CourseDocument } from './schemas/course.schema.js';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CourseService {

  constructor(@InjectModel(Course.name) private coursemodel: Model<CourseDocument>  ){}

  async create(createCourseDto: CreateCourseDto) {
    //add a create course logic
    const { name, description, level, price } = createCourseDto
    if(!name || !description ||!level ||!price){
      return {
        status: 401,
        message: "All Fields are Required"
      }
    }

    const newCourse = new this.coursemodel({name, description, level, price})
    await newCourse.save()

    return {
      status: 201,
      message: "Course Created SuccessFully!",
      data: newCourse
    }

  }

  async findAll() {
    const allCourse = await this.coursemodel.find();
    return allCourse
  }

  async findOne(id: string) {
    const particularCourse = await this.coursemodel.findById(id)
    if(!particularCourse){
      return {
        status: 404,
        message: "Course not found"
      }
    }
    return particularCourse
  }

  update(id: number, updateCourseDto: UpdateCourseDto) {
    return `This action updates a #${id} course`;
  }

  remove(id: number) {
    return `This action removes a #${id} course`;
  }
}
