import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CourseService } from './course.service.js';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';
import { AuthGuard } from '../auth/guards/auth.guards.js';
import { ParseObjectIdPipe } from '../common/pipes/parse.object.id.js';
import { RolesGuard } from '../auth/guards/roles.guards.js';
import { Roles } from '../auth/decorators/roles.decorators.js';
import { Role } from '../user/user.types.js';

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
  findAll() {
    return this.courseService.findAll();
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
}
