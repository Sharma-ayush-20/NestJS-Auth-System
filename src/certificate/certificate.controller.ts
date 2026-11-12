import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import {
  Certificate,
  CertificateDocument,
} from './schemas/certificate.schema.js';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Certificates')
@Controller('certificate')
export class CertificateController {
  constructor(
    @InjectModel(Certificate.name)
    private certificateModel: Model<CertificateDocument>,
  ) {}

  //create a public verification API
  @ApiOperation({ summary: 'Public endpoint to verify a certificate by ID' })
  @Get('verify/:certificateId')
  async verifyCertificate(@Param('certificateId') certificateId: string) {
    const certificate = await this.certificateModel
      .findOne({ certificateId })
      .populate('studentId', 'fname lname email')
      .populate('courseId', 'name description');
    if (!certificate) {
      throw new NotFoundException(
        'Certificate with this ID is invalid or does not exist',
      );
    }

    return {
      isValid: true,
      certificateId: certificate.certificateId,
      issuedTo: (certificate.studentId as any)?.fname + ' ' + (certificate.studentId as any)?.lname,
      courseTitle: (certificate.courseId as any)?.name,
      pdfUrl: certificate.pdfUrl,
      issuedAt: certificate.issuedAt,
    };
  }
}
