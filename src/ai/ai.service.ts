import {
  BadGatewayException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { ConfigService } from '@nestjs/config';
import { generateCurriculumDTO } from './dto/generate-curriculum.dto.js';

@Injectable()
export class AiService {
  private ai: GoogleGenAI;
  private model: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    const model = this.configService.get<string>('GEMINI_MODEL');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is missing');
    }
    if (!model) {
      throw new Error('GEMINI_MODEL is missing');
    }
    this.ai = new GoogleGenAI({ apiKey });
    this.model = model;
  }

  // Generate Course Curriculum
  async generateCurriculum(generateCurriculumDto: generateCurriculumDTO) {
    const prompt = `
    You are an expert instructional designer and technical course creator.
    Create a structured course curriculum based on the following details:
    - Topic: ${generateCurriculumDto.topic}
    - Target Audience: ${generateCurriculumDto.targetAudience}
    - Difficulty Level: ${generateCurriculumDto.difficulty}

    Return a JSON object strictly adhering to this structure:
    {
        "title": "A captivating, professional course title",
        "description": "A comprehensive overview of what students will learn (2-3 sentences)",
        "modules": [
        {
            "title": "Module Title",
            "order": 1,
            "lessons": [
            {
                "title": "Lesson Title",
                "content": "A concise summary of what this lesson covers and key concepts",
                "order": 1
            }
        ]
        }
        ]
    }
        Guidelines:
    - Generate 3 to 5 modules.
    - Each module must have 2 to 4 lessons.
    - Ensure logical pedagogical progression from fundamentals  to    advanced concepts.
    - Do NOT wrap with markdown syntax or backticks. Return raw JSON only.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const text = response.text ?? '';
      return JSON.parse(text);
    } catch (error) {
      console.log('Failed to generate curriculum:', error);
      throw new BadGatewayException(
        'Failed to generate curriculum from AI provider',
      );
    }
  }
}
