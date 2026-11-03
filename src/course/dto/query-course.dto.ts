import { Type } from "class-transformer"
import { IsEnum, IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator"
import { courseLevel } from "../course.type.js"
import { ApiPropertyOptional } from "@nestjs/swagger"

export class QueryCourseDTO {

    @ApiPropertyOptional({ example: 1, default: 1, description: "Page number" })
    @IsOptional()
    @Type(() => Number) // convert query string into number "?page=2" into 2
    @IsInt()
    @Min(1)
    page: number = 1 // Defaults to page 1 if not passed

    @ApiPropertyOptional({ example: 5, default: 5, maximum: 20, description: "Items per page (max 20)" })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(20) // Protects server against memory spikes!
    limit: number = 5

    @ApiPropertyOptional({ enum: courseLevel, description: "Filter by difficulty level" })
    @IsOptional()
    @IsEnum(courseLevel)
    level?: courseLevel

    @ApiPropertyOptional({ example: 5000, description: "Filter courses with price <= this value" })
    @IsOptional()
    @Type(() => Number)
    @Min(0)
    price: number

    @ApiPropertyOptional({ example: "NestJS", description: "Search query matching title or description" })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    search: string

}