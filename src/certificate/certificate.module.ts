import { Module } from '@nestjs/common';
import { CertificateController } from './certificate.controller.js';
import { CertificateService } from './certificate.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Certificate, CertificateSchema } from './schemas/certificate.schema.js';
import { User, UserSchema } from '../user/schemas/user.schema.js';
import { Course, CourseSchema } from '../course/schemas/course.schema.js';
import { BullModule } from '@nestjs/bullmq';
import { CloudinaryModule } from '../cloudinary/cloudinary.module.js';
import { CertificateWorker } from './certificate.worker.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Certificate.name, schema: CertificateSchema},
      { name: User.name, schema: UserSchema },
      { name: Course.name, schema: CourseSchema },
    ]),
    // Register the certificate queue in BullMQ
    BullModule.registerQueue({
      name: 'certificate-queue',
    }),
    CloudinaryModule,
  ],
  controllers: [CertificateController],
  providers: [CertificateService, CertificateWorker],
  exports: [BullModule, CertificateService],
})
export class CertificateModule {}
