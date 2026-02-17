import { IsString, IsNotEmpty, IsOptional, IsDateString, IsInt, Min } from 'class-validator';

export class CreateTimelineDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsNotEmpty()
  startAt: string;

  @IsDateString()
  @IsNotEmpty()
  endAt: string;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  orderIndex: number;
}
