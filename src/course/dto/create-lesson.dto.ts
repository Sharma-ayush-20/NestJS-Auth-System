import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateLessonDTO {
  @ApiProperty({ example: "1.1 Understanding Inversion of Control", description: "Lesson title" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "https://videos.example.com/lessons/ioc-explained.mp4", description: "Video URL" })
  @IsString()
  @IsNotEmpty()
  videoUrl: string;

  @ApiPropertyOptional({ example: 15, default: 1, description: "Duration in minutes" })
  @IsOptional() // Allows omitting the field in the request body
  @IsNumber() // Ensures it must be a number if provided
  @Min(1) // Ensures it cannot be less than 1
  duration: number;

  @ApiProperty({ example: true, description: "Whether this lesson is free to preview without enrolling" })
  @IsBoolean()
  isFreePreview: boolean;
}
