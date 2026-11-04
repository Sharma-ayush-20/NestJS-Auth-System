import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentController } from './payment.controller.js';
import { PaymentService } from './payment.service.js';
import { Course, CourseSchema } from '../course/schemas/course.schema.js';
import { Enrollment, EnrollmentSchema } from '../enrollment/schemas/enrollment.schema.js';
import { EnrollmentModule } from '../enrollment/enrollment.module.js';
import { JwtModule } from '@nestjs/jwt';
import { Payment, PaymentSchema } from './schemas/payment.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema },
      { name: Enrollment.name, schema: EnrollmentSchema },
      { name: Payment.name, schema: PaymentSchema },
    ]),
    EnrollmentModule,
    JwtModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}