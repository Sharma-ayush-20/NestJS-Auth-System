import { Body, Controller, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guards.js';
import { RolesGuard } from '../auth/guards/roles.guards.js';
import { Roles } from '../auth/decorators/roles.decorators.js';
import { Role } from '../user/user.types.js';
import { generateCurriculumDTO } from './dto/generate-curriculum.dto.js';
import { AiService } from './ai.service.js';
import { ParseObjectIdPipe } from '../common/pipes/parse.object.id.js';
import { AskQuestionDTO } from './dto/ask-question.dto.js';

@ApiTags("AI")
@ApiBearerAuth()
@Controller('ai')
export class AiController {

    constructor (
        private readonly aiService: AiService
    ){}

    @ApiOperation({ summary: 'Generate Course Curriculum using Gemini API' })
    @ApiResponse({ status: 201, description: 'Curriculum generated successfully' })
    @Post('generate-curriculum')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.TEACHER, Role.ADMIN)
    async generateCurriculum(
        @Body() generateCurriculumDto: generateCurriculumDTO
    ){
        return this.aiService.generateCurriculum(generateCurriculumDto)
    }

    // student ask question related to that course
    @ApiOperation({ summary: 'Enrolled Student can ask doubt solve using ai' })
    @ApiResponse({ status: 200, description: 'Answer generated based on course context' })
    @Post('/course/:courseId/ask')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.STUDENT)
    async askQuestion(@Param('courseId', ParseObjectIdPipe) courseId: any, @Body() askQuestionDto: AskQuestionDTO, @Request() request: any){
        return this.aiService.generateResponseRelatedToQuestion(courseId, askQuestionDto, request.user)
    }

}
