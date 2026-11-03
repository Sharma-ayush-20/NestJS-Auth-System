import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { Types } from "mongoose";

export class ReviewCourseDTO {
    
    //studentId comes from JWT Token
    //courseId comes from params

    @ApiProperty({ example: 5, minimum: 1, maximum: 5, description: "Rating from 1 to 5 stars" })
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    @Max(5)
    ratings: number

    @ApiPropertyOptional({ example: "Best NestJS course on the internet! Real architecture taught.", description: "Student feedback comment" })
    @IsOptional()
    @IsString()
    comment: string

}