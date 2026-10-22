import { Type } from "class-transformer"
import { IsEnum, IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator"
import { courseLevel } from "../course.type.js"

export class QueryCourseDTO {

    @IsOptional()
    @Type(() => Number) // convert query string into number "?page=2" into 2
    @IsInt()
    @Min(1)
    page: number = 1 // Defaults to page 1 if not passed

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(20) // Protects server against memory spikes!
    limit: number = 5

    @IsOptional()
    @IsEnum(courseLevel)
    level?: courseLevel

    @IsOptional()
    @Type(() => Number)
    @Min(0)
    price: number

    @IsOptional()
    @IsString()
    @MaxLength(50)
    search: string

}