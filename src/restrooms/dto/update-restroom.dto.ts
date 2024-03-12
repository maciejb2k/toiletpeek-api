import { PartialType } from '@nestjs/swagger';
import { CreateRestroomDto } from './create-restroom.dto';

export class UpdateRestroomDto extends PartialType(CreateRestroomDto) {}
