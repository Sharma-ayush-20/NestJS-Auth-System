import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Lesson } from "../schemas/lesson.schema.js";
import { Type } from "class-transformer";
import { CreateLessonDTO } from "./create-lesson.dto.js";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateModuleDTO {

    @ApiProperty({ example: "Module 1: Introduction & Architecture", description: "Module name" })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: "Setting up NestJS project and understanding Dependency Injection", description: "Module summary" })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiPropertyOptional({ type: () => [CreateLessonDTO], description: "Optional initial lessons list" })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateLessonDTO )
    lessons: Lesson[]

}
