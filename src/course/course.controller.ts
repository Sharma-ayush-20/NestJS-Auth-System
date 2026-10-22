import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { CourseService } from './course.service.js';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';
import { AuthGuard } from '../auth/guards/auth.guards.js';
import { ParseObjectIdPipe } from '../common/pipes/parse.object.id.js';
import { RolesGuard } from '../auth/guards/roles.guards.js';
import { Roles } from '../auth/decorators/roles.decorators.js';
import { Role } from '../user/user.types.js';
import { CreateModuleDTO } from './dto/create-module.dto.js';
import { CreateLessonDTO } from './dto/create-lesson.dto.js';
import { QueryCourseDTO } from './dto/query-course.dto.js';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.TEACHER, Role.ADMIN)
  create(@Request() request: any, @Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto, request.user);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(@Query() QueryCouresDto: QueryCourseDTO) {
    return this.courseService.findAll(QueryCouresDto);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.courseService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.TEACHER, Role.ADMIN)
  update(@Param('id', ParseObjectIdPipe) id: string, @Body() updateCourseDto: UpdateCourseDto,
  @Request() request: any) {
    return this.courseService.update(id, updateCourseDto, request.user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  remove(@Param('id', ParseObjectIdPipe) id: string, @Request() request: any) {
    return this.courseService.remove(id, request.user);
  }

  @Post(':id/module')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  createmodule(@Param('id', ParseObjectIdPipe) id: string, @Request() request: any, @Body() createModuleDto: CreateModuleDTO) {
    return this.courseService.createModule(id, request.user, createModuleDto)  
  }

  @Post(':courseId/module/:moduleId/lesson')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  createlesson(@Param('courseId', ParseObjectIdPipe) courseId: string, @Param('moduleId', ParseObjectIdPipe) moduleId: string, @Request() request: any, @Body() createLessonDto: CreateLessonDTO){
    return this.courseService.createLesson(courseId, moduleId, request.user, createLessonDto)
  }
}
