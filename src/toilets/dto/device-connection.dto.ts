import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DeviceConnectionDto {
  @IsNotEmpty()
  toiletId: string;

  @IsNotEmpty()
  deviceId: string;

  @IsNotEmpty()
  token: string;
}
