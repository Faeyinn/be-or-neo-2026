import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 8 })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'Neo Telemetri' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: '2311512036' })
  @IsString()
  @IsNotEmpty()
  nim: string;
}
