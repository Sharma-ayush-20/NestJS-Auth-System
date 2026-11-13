import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guards.js';
import { RolesGuard } from '../auth/guards/roles.guards.js';
import { Roles } from '../auth/decorators/roles.decorators.js';
import { Role } from '../user/user.types.js';
import { generateCurriculumDTO } from './dto/generate-curriculum.dto.js';
import { AiService } from './ai.service.js';

@ApiTags("AI")
@ApiBearerAuth()
@Controller('ai')
export class AiController {

    constructor (
        private readonly aiService: AiService
    ){}

    @ApiOperation({ summary: 'Generate Course Curriculum using Gemini API' })
    @Post('generate-curriculum')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.TEACHER, Role.ADMIN)
    async generateCurriculum(
        @Body() generateCurriculumDto: generateCurriculumDTO
    ){
        return this.aiService.generateCurriculum(generateCurriculumDto)
    }

}
