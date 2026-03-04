import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ExamType } from '../../../../prisma/generated-client/client';

export class ChoiceDto {
  @ApiProperty({ description: 'The text label for the choice' })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({ description: 'Whether this choice is correct' })
  @IsBoolean()
  isCorrect: boolean;

  @ApiProperty({ description: 'Display order of the choice' })
  @IsInt()
  @Min(0)
  orderIndex: number;
}

export class CreateQuestionDto {
  @ApiProperty({ enum: ExamType, description: 'Type of question' })
  @IsEnum(ExamType)
  type: ExamType;

  @ApiProperty({ description: 'The question text' })
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @ApiPropertyOptional({
    description: 'The correct answer for short text questions',
  })
  @IsOptional()
  @IsString()
  correctTextAnswer?: string;

  @ApiProperty({ description: 'Points awarded for this question' })
  @IsInt()
  @Min(0)
  points: number;

  @ApiProperty({ description: 'Display order of the question' })
  @IsInt()
  @Min(0)
  orderIndex: number;

  @ApiPropertyOptional({
    type: [ChoiceDto],
    description: 'Choices for MCQ or True/False',
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ChoiceDto)
  choices?: ChoiceDto[];
}

export class CreateExamDto {
  @ApiProperty({ description: 'Sub Division ID this exam belongs to' })
  @IsUUID()
  subDivisionId: string;

  @ApiProperty({ description: 'Exam title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Exam description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Exam duration in minutes' })
  @IsInt()
  @Min(1)
  durationMinutes: number;

  @ApiPropertyOptional({ description: 'Maximum attempts allowed', default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxAttempts?: number;

  @ApiPropertyOptional({ description: 'Start date and time' })
  @IsOptional()
  @IsString()
  startAt?: string;

  @ApiPropertyOptional({ description: 'End date and time' })
  @IsOptional()
  @IsString()
  endAt?: string;

  @ApiPropertyOptional({
    description: 'Whether the exam is active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    type: [CreateQuestionDto],
    description: 'List of questions for this exam',
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions?: CreateQuestionDto[];
}
