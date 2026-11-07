import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '../user/user.types.js';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course, CourseDocument } from '../course/schemas/course.schema.js';
import {
  Enrollment,
  EnrollmentDocument,
} from '../enrollment/schemas/enrollment.schema.js';
import { EnrollmentService } from '../enrollment/enrollment.service.js';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';
import { Payment, PaymentDocument } from './schemas/payment.schema.js';
import { PaymentStatus } from './types/payment-status.js';
import { VerifyPaymentDTO } from './dto/verify-payment.dto.js';
import * as crypto from 'crypto';
import { User, UserDocument } from '../user/schemas/user.schema.js';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class PaymentService {
  private razorpay: Razorpay;

  constructor(
    private configService: ConfigService,
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(Enrollment.name)
    private enrollmentModel: Model<EnrollmentDocument>,
    private enrollmentService: EnrollmentService,
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectQueue('mail-queue') private mailQueue: Queue,
  ) {
    // Initialize Razorpay instance with keys from .env
    this.razorpay = new Razorpay({
      key_id: configService.get<string>('RAZORPAY_KEY_ID'),
      key_secret: configService.get<string>('RAZORPAY_KEY_SECRET'),
    });
  }

  async createOrder(courseId: string, user: { sub: string; role: Role }) {
    //find the course
    const course = await this.courseModel.findById(courseId);
    if (!course) {
      throw new NotFoundException('Course Not Found');
    }
    //check if the student is already enrolled in that course
    const existingEnrollment = await this.enrollmentModel.findOne({
      studentId: user.sub,
      courseId: courseId,
    });
    if (existingEnrollment) {
      throw new ConflictException('You are already enrolled in this course');
    }

    //Razorpay accepts amounts in paise (1 INR = 100 paise)
    const options = {
      amount: course.price * 100,
      currency: 'INR',
      receipt: `rcpt_${courseId.slice(-6)}_${Date.now()}`,
      notes: {
        courseId: courseId,
        studenId: user.sub,
      },
    };

    const order = await this.razorpay.orders.create(options);

    //save the details in database
    await this.paymentModel.create({
      studentId: new Types.ObjectId(user.sub),
      courseId: new Types.ObjectId(courseId),
      amount: course.price,
      razorpayOrderId: order.id,
      status: PaymentStatus.PENDING,
    });

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      courseName: course.name,
      order
    };
  }

  async verifyPayment(
    verifyDto: VerifyPaymentDTO,
    user: { sub: string; role: Role },
  ) {
    const {
      courseId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = verifyDto;
    //find the payment
    const payment = await this.paymentModel.findOne({
      razorpayOrderId: razorpay_order_id,
    });
    if (!payment) {
      throw new NotFoundException('Payment Not Done');
    }
    //check if already verified
    if (payment.status === PaymentStatus.SUCCESS) {
      throw new BadRequestException('Payment already Verified');
    }
    //generate a cryptographic signature to check with the razorpay
    const secret = this.configService.get<string>('RAZORPAY_KEY_SECRET') || '';
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    //compare this both razorpay_Signature and genrateSignature to verify
    if (generatedSignature !== razorpay_signature) {
      payment.status = PaymentStatus.FAILED;
      await payment.save();
      throw new BadRequestException(
        'Invalid payment signature. Transaction may be tampered!',
      );
    }

    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = PaymentStatus.SUCCESS;
    await payment.save();

    await this.enrollmentService.enrollcourse(courseId, {
      sub: user.sub,
      role: Role.STUDENT,
    });

    //send payment Receipt Email via Queue
    const student = await this.userModel.findById(user.sub)
    const course = await this.courseModel.findById(courseId)

    if(student && course){
      await this.mailQueue.add('sendPaymentReceipt', {
        to: student.email,
        name: student.fname,
        courseName: course.name,
        amount: payment.amount,
        paymentId: razorpay_payment_id,
      }, { attempts: 3, backoff: 5000 })
    }


    return {
      message: 'Payment verified and course enrolled successfully!',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    };
  }
}
