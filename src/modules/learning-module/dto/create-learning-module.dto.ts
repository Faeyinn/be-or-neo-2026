import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateLearningModuleDto {
  @ApiProperty({ example: 'Introduction to Web Development' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Basic HTML, CSS, and JS' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'subdivision-uuid-here' })
  @IsUUID()
  @IsNotEmpty()
  subDivisionId: string;
}
