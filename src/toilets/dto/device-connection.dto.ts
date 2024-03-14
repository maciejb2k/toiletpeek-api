import { IsNotEmpty } from 'class-validator';

export class DeviceConnectionDto {
  @IsNotEmpty()
  toiletId: string;

  @IsNotEmpty()
  token: string;
}
