import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class StartExamDto {
  @ApiProperty({ example: 'exam-uuid-here' })
  @IsUUID()
  @IsNotEmpty()
  examId: string;
}

export class SubmitAnswerDto {
  @ApiProperty({ example: 'question-uuid-here' })
  @IsUUID()
  @IsNotEmpty()
  questionId: string;

  @ApiPropertyOptional({ example: 'choice-uuid-here' })
  @IsUUID()
  @IsOptional()
  chosenChoiceId?: string;

  @ApiPropertyOptional({ example: 'Sample text answer' })
  @IsString()
  @IsOptional()
  textAnswer?: string;
}

export class SubmitExamDto {
  @ApiProperty({ type: [SubmitAnswerDto] })
  @IsNotEmpty()
  answers: SubmitAnswerDto[];
}
