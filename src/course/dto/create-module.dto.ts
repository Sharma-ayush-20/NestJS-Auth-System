import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Lesson } from "../schemas/lesson.schema.js";
import { Type } from "class-transformer";
import { CreateLessonDTO } from "./create-lesson.dto.js";

export class CreateModuleDTO {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateLessonDTO )
    lessons: Lesson[]

}
