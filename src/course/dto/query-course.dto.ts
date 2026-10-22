import { Type } from "class-transformer"
import { IsInt, IsOptional, Max, Min } from "class-validator"

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

}