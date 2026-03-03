import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateQrDto {
  @ApiProperty({
    example: 'uuid-timeline-event',
    description: 'The ID of the recruitment timeline event',
  })
  @IsNotEmpty()
  @IsUUID()
  timelineId: string;

  @ApiProperty({
    example: 'TOKEN123',
    description: 'The passcode to be encoded in the QR Code',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  passcode: string;
}
