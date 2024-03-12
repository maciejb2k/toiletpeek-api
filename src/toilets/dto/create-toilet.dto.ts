import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateToiletDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}
