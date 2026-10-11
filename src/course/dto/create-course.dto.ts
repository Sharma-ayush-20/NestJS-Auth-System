import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { courseLevel } from "../course.type.js";

export class CreateCourseDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsEnum(courseLevel, {
        message: "level must be either beginner, intermediate and advanced."
    })
    @IsString()
    @IsNotEmpty()
    level: courseLevel

    @IsNumber()
    @IsNotEmpty()
    price: number

}
