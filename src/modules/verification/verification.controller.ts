import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { VerificationService } from './verification.service';
import { CreateVerificationDto } from './dto/create-verification.dto';

@ApiTags('Verification')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user verification status' })
  @ApiResponse({ status: 200, description: 'Return current user verification data.' })
  async getMyVerification(@GetUser('id') userId: string) {
    return this.verificationService.getMyVerification(userId);
  }

  @Post('submit')
  @ApiOperation({ summary: 'Submit or update verification documents' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Verification documents successfully submitted.' })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'krsScan', maxCount: 1 },
      { name: 'formalPhoto', maxCount: 1 },
      { name: 'instagramProof', maxCount: 1 },
      { name: 'instagramMarketingProof', maxCount: 1 },
    ]),
  )
  async submitVerification(
    @GetUser('id') userId: string,
    @Body() dto: CreateVerificationDto,
    @UploadedFiles()
    files: {
      krsScan?: Express.Multer.File[];
      formalPhoto?: Express.Multer.File[];
      instagramProof?: Express.Multer.File[];
      instagramMarketingProof?: Express.Multer.File[];
    },
  ) {
    return this.verificationService.submitVerification(userId, dto, files);
  }
}
