import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../user/schemas/user.schema.js';
import { Course } from '../../course/schemas/course.schema.js';
import { PaymentStatus } from '../types/payment-status.js';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
  studentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Course.name, required: true, index: true })
  courseId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'INR' })
  currency: string;

  @Prop({ required: true, unique: true, index: true })
  razorpayOrderId: string;

  @Prop({ required: false, unique: true, sparse: true })
  razorpayPaymentId?: string;

  @Prop({ required: false })
  razorpaySignature?: string;

  @Prop({
    required: true,
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

// Compound index to quickly look up a student's payments
PaymentSchema.index({ studentId: 1, createdAt: -1 });