import { Inject, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { IStorageService } from '../../common/services/storage/storage.interface';
import { CreateVerificationDto } from './dto/create-verification.dto';
import { ReviewVerificationDto } from './dto/review-verification.dto';
import { VerificationStatus } from '../../../prisma/generated-client/client';

@Injectable()
export class VerificationService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('IStorageService') private readonly storageService: IStorageService,
  ) {}

  async findAll(status?: VerificationStatus) {
    return this.prisma.submissionVerification.findMany({
      where: status ? { status } : {},
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                fullName: true,
                nim: true,
                subDivision: { select: { name: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async reviewSubmission(
    id: string,
    adminId: string,
    dto: ReviewVerificationDto,
  ) {
    const verification = await this.prisma.submissionVerification.findUnique({
      where: { id },
    });

    if (!verification) {
      throw new NotFoundException('Verification submission not found');
    }

    return this.prisma.submissionVerification.update({
      where: { id },
      data: {
        status: dto.status,
        rejectionReason: dto.rejectionReason,
        reviewedByAdminId: adminId,
        reviewedAt: new Date(),
      },
    });
  }

  async getMyVerification(userId: string) {
    return this.prisma.submissionVerification.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async submitVerification(
    userId: string,
    dto: CreateVerificationDto,
    files: {
      krsScan?: Express.Multer.File[];
      formalPhoto?: Express.Multer.File[];
      instagramProof?: Express.Multer.File[];
      instagramMarketingProof?: Express.Multer.File[];
    },
  ) {
    const data: any = {
      userId,
      twibbonLink: dto.twibbonLink,
    };

    if (files.krsScan?.[0]) {
      data.krsScanUrl = await this.storageService.uploadFile(files.krsScan[0], 'verifications/krs');
    }
    if (files.formalPhoto?.[0]) {
      data.formalPhotoUrl = await this.storageService.uploadFile(files.formalPhoto[0], 'verifications/photo');
    }
    if (files.instagramProof?.[0]) {
      data.instagramProofUrl = await this.storageService.uploadFile(files.instagramProof[0], 'verifications/ig-proof');
    }
    if (files.instagramMarketingProof?.[0]) {
      data.instagramMarketingProofUrl = await this.storageService.uploadFile(files.instagramMarketingProof[0], 'verifications/ig-marketing');
    }

    // Check if user already has a pending verification
    const existing = await this.prisma.submissionVerification.findFirst({
      where: { userId, status: 'PENDING' },
    });

    if (existing) {
      return this.prisma.submissionVerification.update({
        where: { id: existing.id },
        data,
      });
    }

    return this.prisma.submissionVerification.create({
      data,
    });
  }
}
