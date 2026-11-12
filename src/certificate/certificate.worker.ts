import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { CertificateService } from '../certificate/certificate.service.js';
import { CloudinaryService } from '../cloudinary/cloudinary.service.js';
import { InjectModel } from '@nestjs/mongoose';
import {
  Certificate,
  CertificateDocument,
} from './schemas/certificate.schema.js';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../user/schemas/user.schema.js';
import { Course, CourseDocument } from '../course/schemas/course.schema.js';
import { Job } from 'bullmq';

@Processor('certificate-queue')
export class CertificateWorker extends WorkerHost {
  private readonly logger = new Logger(CertificateWorker.name);

  constructor(
    private certificateService: CertificateService,
    private cloudinaryService: CloudinaryService,
    @InjectModel(Certificate.name)
    private certificateModel: Model<CertificateDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
  ) {
    super();
  }

  async process(
    job: Job<{ studentId: string; courseId: string }>,
  ): Promise<any> {
    this.logger.log(`Processing certificate for job ID: ${job.id}`);
    const { studentId, courseId } = job.data;

    //check if certificate is already exists
    const existingCert = await this.certificateModel.findOne({
      studentId: new Types.ObjectId(studentId),
      courseId: new Types.ObjectId(courseId),
    });
    if (existingCert) {
      this.logger.warn(
        `Certificate already exists for student ${studentId} in course ${courseId}`,
      );
      return existingCert;
    }

    //fetch student and course details
    const student = await this.userModel.findById(studentId);
    const course = await this.courseModel.findById(courseId);

    if (!student || !course) {
      throw new Error('Student or Course not found for certificate generation');
    }

    const studentFullName = `${student.fname} ${student.lname}`.trim();

    //generate unique human readable code
    const certificateId = `LMS-CERT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const completionDate = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    // Generate a High-res PDF Buffer using PDFKit
    const pdfBuffer = await this.certificateService.generateCertificateBuffer({
      studentName: studentFullName,
      courseName: course.name,
      certificateId,
      completionDate,
    });

    // Upload Buffer directly to Cloudinary
    const uploadResult = await this.cloudinaryService.uploadPdfBuffer(
      pdfBuffer,
      certificateId,
      `lms/certificates`,
    );

    // Save Certificate record in MongoDB
    const newCertificate = await this.certificateModel.create({
      certificateId,
      studentId: new Types.ObjectId(studentId),
      courseId: new Types.ObjectId(courseId),
      pdfUrl: uploadResult.secure_url,
      issuedAt: new Date(),
    });

    this.logger.log(
      `Certificate generated successfully: ${certificateId} (${uploadResult.secure_url})`,
    );

    return newCertificate;
  }
}
