import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { EmployeeAccessService } from '../employee-access.service';
import { validate } from 'class-validator';
import { EmployeeSignInDto } from '../dto/employee-sign-in.dto';

@Injectable()
export class LocalEmployeeStrategy extends PassportStrategy(
  Strategy,
  'employee',
) {
  constructor(private employeeAccessService: EmployeeAccessService) {
    super({
      usernameField: 'organizationId',
    });
  }

  async validate(organizationId: string, password: string) {
    const signInDto = new EmployeeSignInDto();
    signInDto.organizationId = organizationId;
    signInDto.password = password;

    const errors = await validate(signInDto);

    console.log(errors);

    if (errors.length > 0) {
      const errorMessages = errors.map((error) =>
        Object.values(error.constraints).join(', '),
      );
      throw new BadRequestException(errorMessages);
    }

    return await this.employeeAccessService.validateEmployee(
      organizationId,
      password,
    );
  }
}
