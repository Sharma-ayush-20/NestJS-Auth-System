import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class VerifyPaymentDTO {

    @ApiProperty({ example: '66a123', description: 'Course ID being purchased' })
    @IsString()
    @IsNotEmpty()
    courseId: string;

    @ApiProperty({ example: 'order_M9z9...', description: 'Razorpay Order ID' })
    @IsString()
    @IsNotEmpty()
    razorpay_order_id: string;

    @ApiProperty({ example: 'pay_M9zA...', description: 'Razorpay Payment ID' })
    @IsString()
    @IsNotEmpty()
    razorpay_payment_id: string;

    @ApiProperty({ example: '9ef8a1...', description: 'Cryptographic HMAC signature from Razorpay' })
    @IsString()
    @IsNotEmpty()
    razorpay_signature: string;
}