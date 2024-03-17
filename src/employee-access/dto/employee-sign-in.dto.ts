import { IsNotEmpty, IsUUID } from 'class-validator';

export class EmployeeSignInDto {
  @IsNotEmpty()
  @IsUUID()
  organizationId: string;

  @IsNotEmpty()
  password: any;
}
