import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { courseLevel } from "../course.type.js";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCourseDto {

    @ApiProperty({ example: "Mastering NestJS & Microservices", description: "Course title" })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: "Comprehensive guide to building production-grade backends with NestJS, Redis, and MongoDB", description: "Course description" })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ enum: courseLevel, example: courseLevel.INTERMEDIATE, description: "Course difficulty level" })
    @IsEnum(courseLevel, {
        message: "level must be either beginner, intermediate and advanced."
    })
    @IsString()
    @IsNotEmpty()
    level: courseLevel

    @ApiProperty({ example: 4999, description: "Course price in INR" })
    @IsNumber()
    @IsNotEmpty()
    price: number

}
