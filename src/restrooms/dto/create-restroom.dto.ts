import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { RestroomType } from '../entities/restroom.entity';

export class CreateRestroomDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  floor: number;

  @ApiProperty()
  @IsEnum(RestroomType)
  @IsNotEmpty()
  type: RestroomType;
}
