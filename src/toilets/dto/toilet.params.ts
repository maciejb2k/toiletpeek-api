import { IsNotEmpty, IsUUID } from 'class-validator';

export class ToiletParams {
  @IsUUID()
  @IsNotEmpty()
  organizationId: string;

  @IsUUID()
  @IsNotEmpty()
  restroomId: string;
}
