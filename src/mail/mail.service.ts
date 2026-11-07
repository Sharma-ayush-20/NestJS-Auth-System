import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { welcomeEmailTemplate } from './templates/welcome-email.template.js';
import { tryCatch } from 'bullmq';
import { paymentReceiptTemplate } from './templates/payment-receipt.template.js';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    //declare the mail sending process
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST', 'smtp.gmail.com'),
      port: Number(this.configService.get<number>('MAIL_PORT', 587)),
      secure: false,
      auth: {
        user: this.configService.get<string>('MAIL_USER', ''),
        pass: this.configService.get<string>('MAIL_PASS', ''),
      },
    });
  }

  //send Welcome Email when student enrolled in particular course
  async sendWelcomeEmail(to: string, name: string, courseName: string) {
    const mailOptions = {
      from: this.configService.get<string>(
        'MAIL_FROM',
        '"LMS Academy" <no-reply@lms.com>',
      ),
      to,
      subject: `Welcome to ${courseName}!`,
      html: welcomeEmailTemplate(name, courseName),
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(
        `Welcome email sent to ${to} (MessageId: ${info.messageId})`,
      );
    } catch (error: any) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`);
      throw error;
    }
  }

  // 2. Send Payment Receipt Email
  async sendPaymentReceiptEmail(to: string, name: string, courseName: string, amount: number, paymentId: string) {
    const mailOptions = {
      from: this.configService.get<string>('MAIL_FROM', '"LMS Academy" <no-reply@lms.com>'),
      to,
      subject: `🧾 Payment Receipt for ${courseName}`,
      html: paymentReceiptTemplate(name, courseName, amount, paymentId)
    };
    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Receipt email sent to ${to}`);
      return info;
    } catch (error: any) {
      this.logger.error(`Failed to send receipt to ${to}: ${error.message}`);
      throw error;
    }
  }

}
