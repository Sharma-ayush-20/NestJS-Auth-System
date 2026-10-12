import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';
import { Course, CourseDocument } from './schemas/course.schema.js';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CourseService {

  constructor(@InjectModel(Course.name) private coursemodel: Model<CourseDocument>  ){}

  async create(createCourseDto: CreateCourseDto) {
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

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const updatedCourse = await this.coursemodel.findByIdAndUpdate(id, updateCourseDto, {
      returnDocument: 'after',
    })
    if(!updatedCourse){
      throw new NotFoundException('Course not found');
    }
    return {
      status: 200,
      message: "Course updated Sucessfully!",
      data: updatedCourse
    }
  }

  async remove(id: string) {
    const deletedCourse = await this.coursemodel.findByIdAndDelete(id, {returnDocument: 'after'})
    if (!deletedCourse) {
    throw new NotFoundException('Course not found');
  }
    return {
      status: 200,
      message: `${deletedCourse?.name} is deleted Successfully!`,
      data: deletedCourse
    }
  }
}
