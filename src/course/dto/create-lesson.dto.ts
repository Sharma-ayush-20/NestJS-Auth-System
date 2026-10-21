import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateLessonDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  videoUrl: string;

  @IsOptional() // Allows omitting the field in the request body
  @IsNumber() // Ensures it must be a number if provided
  @Min(1) // Ensures it cannot be less than 1
  duration: number;

  @IsBoolean()
  isFreePreview: boolean;
}
