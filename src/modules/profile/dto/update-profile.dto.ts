import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Neo Telemetri' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  fullName?: string;

  @ApiPropertyOptional({ example: 'Neo' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  nickName?: string;

  @ApiPropertyOptional({ example: '08123456789' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  whatsappNumber?: string;

  @ApiPropertyOptional({ example: 'Sistem Informasi' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  studyProgram?: string;

  @ApiPropertyOptional({ example: 'uuid-department' })
  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @ApiPropertyOptional({ example: 'uuid-division' })
  @IsOptional()
  @IsUUID()
  divisionId?: string;

  @ApiPropertyOptional({ example: 'uuid-sub-division' })
  @IsOptional()
  @IsUUID()
  subDivisionId?: string;
}
