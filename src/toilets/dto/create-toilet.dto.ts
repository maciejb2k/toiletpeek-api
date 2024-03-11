import { IsEnum, IsNotEmpty } from 'class-validator';
import { ToiletType } from '../entities/toilet.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateToiletDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ToiletType)
  type: ToiletType;
}
