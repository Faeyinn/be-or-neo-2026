import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { PaymentStatus, PaymentProvider } from '../../../prisma/generated-client/client';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const midtransClient = require('midtrans-client');

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private readonly snap: any;

  constructor(private readonly prisma: PrismaService) {
    this.snap = new midtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });
  }

  async createTransaction(userId: string) {
    // 1. Check user profile and verification status
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        submissionVerifications: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!user || !user.profile) {
      throw new BadRequestException('Lengkapi profil terlebih dahulu');
    }

    const verification = user.submissionVerifications[0];
    if (!verification || verification.status !== 'APPROVED') {
      throw new BadRequestException(
        'Berkas pendaftaran harus disetujui (APPROVED) sebelum melakukan pembayaran',
      );
    }

    // 2. Check if user already has a PAID or PENDING payment
    const existingPayment = await this.prisma.payment.findFirst({
      where: {
        userId,
        status: { in: [PaymentStatus.PAID, PaymentStatus.PENDING] },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (existingPayment) {
      if (existingPayment.status === PaymentStatus.PAID) {
        throw new BadRequestException('Anda sudah melunasi pembayaran');
      }
      // If PENDING, return the existing payment URL
      if (existingPayment.paymentUrl) {
        return {
          paymentUrl: existingPayment.paymentUrl,
          status: existingPayment.status,
          amount: existingPayment.amount,
        };
      }
    }

    // 3. Prepare Midtrans transaction
    const orderId = `OR-NEO-${Date.now()}-${userId.substring(0, 8)}`;
    const amount = 50000; // Biaya pendaftaran default

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      customer_details: {
        first_name: user.profile.fullName,
        email: user.email,
        phone: user.profile.whatsappNumber,
      },
      callbacks: {
        finish: `${process.env.FRONTEND_URL}/dashboard`,
        error: `${process.env.FRONTEND_URL}/dashboard`,
        pending: `${process.env.FRONTEND_URL}/dashboard`,
      },
    };

    try {
      const transaction = await this.snap.createTransaction(parameter);

      // 4. Save to database
      const payment = await this.prisma.payment.create({
        data: {
          id: orderId, // Use order_id as PK for easier lookup in webhook
          userId,
          provider: PaymentProvider.MIDTRANS,
          amount,
          status: PaymentStatus.PENDING,
          paymentUrl: transaction.redirect_url,
          externalPaymentId: transaction.token,
        },
      });

      return {
        paymentUrl: payment.paymentUrl,
        status: payment.status,
        amount: payment.amount,
      };
    } catch (error) {
      this.logger.error('Midtrans transaction creation failed', error);
      throw new BadRequestException('Gagal membuat transaksi pembayaran');
    }
  }

  async handleWebhook(payload: any) {
    const { order_id, transaction_status, fraud_status } = payload;

    this.logger.log(`Received Midtrans webhook: ${order_id} - ${transaction_status}`);

    const payment = await this.prisma.payment.findUnique({
      where: { id: order_id },
    });

    if (!payment) {
      this.logger.warn(`Payment with order_id ${order_id} not found`);
      return;
    }

    let status: PaymentStatus = payment.status;

    if (transaction_status === 'capture') {
      if (fraud_status === 'challenge') {
        status = PaymentStatus.PENDING;
      } else if (fraud_status === 'accept') {
        status = PaymentStatus.PAID;
      }
    } else if (transaction_status === 'settlement') {
      status = PaymentStatus.PAID;
    } else if (
      transaction_status === 'cancel' ||
      transaction_status === 'deny' ||
      transaction_status === 'expire'
    ) {
      status = PaymentStatus.FAILED;
    } else if (transaction_status === 'pending') {
      status = PaymentStatus.PENDING;
    }

    return this.prisma.payment.update({
      where: { id: order_id },
      data: {
        status,
        paidAt: status === PaymentStatus.PAID ? new Date() : null,
      },
    });
  }

  async findAll() {
    return this.prisma.payment.findMany({
      include: {
        user: {
          select: {
            email: true,
            profile: { select: { fullName: true, nim: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
