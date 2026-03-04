import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateDepartmentDto {
  @ApiProperty({ example: 'Departemen Teknologi Informasi' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateDepartmentDto {
  @ApiProperty({ example: 'Departemen Teknologi Informasi Terbaru' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateDivisionDto {
  @ApiProperty({ example: 'Divisi Web Development' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'uuid-department' })
  @IsUUID()
  @IsNotEmpty()
  departmentId: string;
}

export class UpdateDivisionDto {
  @ApiProperty({ example: 'Divisi Mobile Development' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'uuid-department' })
  @IsUUID()
  @IsOptional()
  departmentId?: string;
}

export class CreateSubDivisionDto {
  @ApiProperty({ example: 'Sub-Divisi Frontend' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'uuid-division' })
  @IsUUID()
  @IsNotEmpty()
  divisionId: string;
}

export class UpdateSubDivisionDto {
  @ApiProperty({ example: 'Sub-Divisi Backend' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'uuid-division' })
  @IsUUID()
  @IsOptional()
  divisionId?: string;
}
