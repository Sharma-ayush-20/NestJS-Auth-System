import {
  BadGatewayException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { ConfigService } from '@nestjs/config';
import { generateCurriculumDTO } from './dto/generate-curriculum.dto.js';
import { AskQuestionDTO } from './dto/ask-question.dto.js';
import { Role } from '../user/user.types.js';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/schemas/user.schema.js';
import { Course, CourseDocument } from '../course/schemas/course.schema.js';
import { Model } from 'mongoose';
import {
  Enrollment,
  EnrollmentDocument,
} from '../enrollment/schemas/enrollment.schema.js';

@Injectable()
export class AiService {
  private ai: GoogleGenAI;
  private model: string;

  constructor(
    private configService: ConfigService,
    @InjectModel(Course.name) private coursemodel: Model<CourseDocument>,
    @InjectModel(User.name) private usermodel: Model<UserDocument>,
    @InjectModel(Enrollment.name)
    private enrollmentModel: Model<EnrollmentDocument>,
  ) {
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

  async generateResponseRelatedToQuestion(
    courseId: string,
    askQuestionDto: AskQuestionDTO,
    user: { sub: string; role: Role },
  ) {
    //find the student
    const student = await this.usermodel.findById(user.sub);
    if (!student) {
      throw new NotFoundException('Student Not Found');
    }
    //find the course details
    const course = await this.coursemodel.findById(courseId);
    if (!course) {
      throw new NotFoundException('Course Not Found');
    }
    //check student enrolled in this course
    const enrolledStudent = await this.enrollmentModel.findOne({
      studentId: user.sub,
      courseId: courseId,
    });
    if (!enrolledStudent) {
      throw new NotFoundException(
        'You must be enrolled in this course to ask questions',
      );
    }

    // Summarize syllabus context for the AI prompt
    const syllabusContext = course.modules
      .map((m, mIdx) => {
        const lessons = m.lessons
          .map(
            (l, lIdx) => `Lesson ${lIdx + 1}: ${l.name} (${l.duration} mins)`,
          )
          .join('\n');
        return `Module ${mIdx + 1}: ${m.name} - ${m.description}\n${lessons}`;
      })
      .join('\n\n');

    // Construct context-aware prompt
    const contextPrompt = `
    You are an intelligent, helpful, and friendly AI Teaching Assistant for an online course.
    Course Details:
    - Title: ${course.name}
    - Level: ${course.level}
    - Description: ${course.description}
    Course Syllabus:
    ${syllabusContext}
    Student's Question:
    "${askQuestionDto.prompt}"
    Guidelines for your response:
    1. Answer clearly, accurately, and encouragingly.
    2. Relate your explanation directly to the course lessons and topics where relevant.
    3. If the question asks about something completely unrelated to the course topic, politely steer the student back to the course.
    4. Keep the explanation concise and easy to understand.
    `;

    // 6. Call Gemini
    try {
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: contextPrompt,
      });
      return {
        courseId: course._id,
        courseTitle: course.name,
        question: askQuestionDto.prompt,
        answer: response.text ?? 'No response generated.',
      };
    } catch (error) {
      console.error('Failed to generate answer from AI:', error);
      throw new BadGatewayException(
        'Failed to generate response from AI provider',
      );
    }
  }
}
