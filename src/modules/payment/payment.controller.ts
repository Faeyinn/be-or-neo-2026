import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { UserRole } from '../../../prisma/generated-client/client';

@ApiTags('Payment')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User: Create a payment transaction' })
  @ApiResponse({
    status: 201,
    description: 'Transaction successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Already paid or payment pending.' })
  async createTransaction(@GetUser('id') userId: string) {
    return this.paymentService.createTransaction(userId);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Public: Midtrans webhook callback' })
  @ApiResponse({ status: 200, description: 'Webhook processed.' })
  async handleWebhook(@Body() payload: any) {
    return this.paymentService.handleWebhook(payload);
  }

  @Get('admin/list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: List all payments' })
  @ApiResponse({ status: 200, description: 'Return all payments.' })
  async findAll() {
    return this.paymentService.findAll();
  }
}
