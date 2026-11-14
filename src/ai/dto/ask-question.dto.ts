import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class AskQuestionDTO {

    @ApiProperty({ example: "Give me overview of Module 1 lesson 2 ?",description: "Student prompt" })
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(500)
    prompt: string
    
}