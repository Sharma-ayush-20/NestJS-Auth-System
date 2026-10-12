import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './create-course.dto.js';

/**
NestJS's PartialType() utility does two powerful things automatically:
1) Inherits All Properties and Validation Rules:
It copies all properties (name, description, level, price) and 
their validation types (@IsString(), @IsNumber(), @IsEnum()) from create-course.dto.ts.
2) Converts Everything to Optional: 
It removes the requirement for every field to be present (internally applying @IsOptional()).
 */

export class UpdateCourseDto extends PartialType(CreateCourseDto) {}
