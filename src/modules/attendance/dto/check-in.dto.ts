import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckInDto {
  @ApiProperty({
    example: 'uuid-timeline-event',
    description: 'The ID of the recruitment timeline event',
  })
  @IsNotEmpty()
  @IsUUID()
  timelineId: string;

  @ApiProperty({
    example: 'TOKEN123',
    description: 'The passcode from the scanned QR Code',
  })
  @IsNotEmpty()
  @IsString()
  passcode: string;
}
