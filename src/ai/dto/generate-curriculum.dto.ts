import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { courseLevel } from '../../course/course.type.js';

export class generateCurriculumDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(150)
  topic: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(300)
  targetAudience: string;

  @IsEnum(courseLevel, {
    message: 'Difficulty must be beginner, intermediate, or advanced',
  })
  difficulty: courseLevel;
}
