import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateAssignmentDto {
  @ApiProperty({ example: 'Project 1: Personal Portfolio' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Build a one-page portfolio using HTML/CSS' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2026-12-31T23:59:59Z' })
  @IsDateString()
  @IsNotEmpty()
  dueAt: string;

  @ApiProperty({ example: 'subdivision-uuid-here' })
  @IsUUID()
  @IsNotEmpty()
  subDivisionId: string;
}
