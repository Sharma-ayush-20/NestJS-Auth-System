import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { courseLevel } from "../course.type.js";

export class CreateCourseDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    level: courseLevel

    @IsNumber()
    @IsNotEmpty()
    price: number

}
