import { IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVerificationDto {
  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  krsScan?: any;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  formalPhoto?: any;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  instagramProof?: any;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  instagramMarketingProof?: any;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsUrl()
  twibbonLink?: string;
}
