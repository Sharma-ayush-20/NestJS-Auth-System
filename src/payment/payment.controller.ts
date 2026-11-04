import { Body, Controller, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service.js';
import { AuthGuard } from '../auth/guards/auth.guards.js';
import { RolesGuard } from '../auth/guards/roles.guards.js';
import { Roles } from '../auth/decorators/roles.decorators.js';
import { Role } from '../user/user.types.js';
import { ParseObjectIdPipe } from '../common/pipes/parse.object.id.js';
import { VerifyPaymentDTO } from './dto/verify-payment.dto.js';

@ApiTags('Payment')
@ApiBearerAuth()
@Controller('payment')
export class PaymentController {
    constructor (private readonly paymentService: PaymentService){}

    @ApiOperation({ summary: 'Create a Razorpay order for purchasing a course' })
    @Post('create-order/:courseId')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.STUDENT)
    createOrder(@Param('courseId', ParseObjectIdPipe) courseId: string, @Request() request: any){
        return this.paymentService.createOrder(courseId, request.user)
    }

    @ApiOperation({ summary: 'Verify payment signature & auto-enroll student' })
    @Post('verify')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.STUDENT)
    verifyPayment(@Body() verifyPaymentDto: VerifyPaymentDTO, @Request() request: any){
        return this.paymentService.verifyPayment(verifyPaymentDto, request.user)
    }
}
