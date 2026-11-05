import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
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
import 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Courses')
@ApiBearerAuth()
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @ApiOperation({ summary: 'Create a new course (Teacher/Admin only)' })
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.TEACHER, Role.ADMIN)
  create(@Request() request: any, @Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto, request.user);
  }

  @ApiOperation({ summary: 'Get all courses with pagination, search & Redis caching' })
  @Get()
  @UseGuards(AuthGuard)
  async findAll(@Query() QueryCouresDto: QueryCourseDTO) {
    return this.courseService.findAll(QueryCouresDto);
  }

  @ApiOperation({ summary: 'Get course details by ID' })
  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.courseService.findOne(id);
  }

   @ApiOperation({ summary: 'Update course details (Instructor/Admin only)' })
  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.TEACHER, Role.ADMIN)
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @Request() request: any,
  ) {
    return this.courseService.update(id, updateCourseDto, request.user);
  }

  @ApiOperation({ summary: 'Delete a course (Instructor/Admin only)' })
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  remove(@Param('id', ParseObjectIdPipe) id: string, @Request() request: any) {
    return this.courseService.remove(id, request.user);
  }

  @ApiOperation({ summary: 'Add a new module to a course' })
  @Post(':id/module')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  createmodule(
    @Param('id', ParseObjectIdPipe) id: string,
    @Request() request: any,
    @Body() createModuleDto: CreateModuleDTO,
  ) {
    return this.courseService.createModule(id, request.user, createModuleDto);
  }

  @ApiOperation({ summary: 'Add a new lesson inside a course module' })
  @Post(':courseId/module/:moduleId/lesson')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  createlesson(
    @Param('courseId', ParseObjectIdPipe) courseId: string,
    @Param('moduleId', ParseObjectIdPipe) moduleId: string,
    @Request() request: any,
    @Body() createLessonDto: CreateLessonDTO,
  ) {
    return this.courseService.createLesson(
      courseId,
      moduleId,
      request.user,
      createLessonDto,
    );
  }

  @ApiOperation({ summary: 'Upload course thumbnail image to Cloudinary' })
  @Patch(':courseId/thumbnail')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  @UseInterceptors(FileInterceptor('thumbnail'))
  uploadThumbnail(
    @Param('courseId', ParseObjectIdPipe) courseId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }), // 2MB max
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Request() request: any,
  ) {
    return this.courseService.uploadThumbnail(courseId, request.user, file);
  }

  //teacher analytics
  @ApiOperation({ summary: 'Teacher Analytics regarding to therir course, enrollment, student, review and all details' })
  @Get('instructor/analytics')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.TEACHER, Role.ADMIN)
  teacherAnalytics(@Request() request: any){
    return this.courseService.teacheranalytics(request.user)
  }
}
