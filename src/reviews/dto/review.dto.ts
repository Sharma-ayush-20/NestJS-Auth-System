import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { Types } from "mongoose";

export class ReviewCourseDTO {
    
    //studentId comes from JWT Token
    //courseId comes from params

    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    @Max(5)
    ratings: number

    @IsOptional()
    @IsString()
    comment: string

}