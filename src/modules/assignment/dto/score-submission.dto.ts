import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class ScoreSubmissionDto {
  @ApiProperty({ example: 85.5 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsNotEmpty()
  score: number;

  @ApiPropertyOptional({ example: 'Great work, but focus on responsiveness.' })
  @IsString()
  @IsOptional()
  feedback?: string;
}
