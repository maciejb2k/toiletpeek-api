import { IsNotEmpty, IsUUID } from 'class-validator';

export class RestroomParams {
  @IsUUID()
  @IsNotEmpty()
  organizationId: string;
}
