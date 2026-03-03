import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsInt,
  Min,
} from 'class-validator';

export class CreateTimelineDto {
  @ApiProperty({ example: 'Pendaftaran' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Masa pendaftaran calon anggota baru' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2026-03-01T00:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  startAt: string;

  @ApiProperty({ example: '2026-03-14T23:59:59Z' })
  @IsDateString()
  @IsNotEmpty()
  endAt: string;

  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  orderIndex: number;
}
