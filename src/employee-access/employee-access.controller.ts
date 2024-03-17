import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LocalEmployeeAuthGuard } from './guards/local-employee-auth.guard';
import { User as Token, User as Organization } from 'src/common/decorators';
import { EmployeeAccessService } from './employee-access.service';
import { JwtEmployeeAuthGuard } from './guards/jwt-employee-auth.guard';
import { EmployeeAccessJWT } from './types';
import { Organization as OrganizationEntity } from 'src/organizations/entities/organization.entity';

@ApiTags('employee-access')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('employee-access')
export class EmployeeAccessController {
  constructor(private employeeAccessService: EmployeeAccessService) {}

  @UseGuards(LocalEmployeeAuthGuard)
  @Post('sign-in')
  async signIn(@Organization() organization: OrganizationEntity) {
    return this.employeeAccessService.signIn(organization);
  }

  @UseGuards(JwtEmployeeAuthGuard)
  @Get()
  async getRestrooms(@Token() token: EmployeeAccessJWT) {
    return await this.employeeAccessService.getRestrooms(token);
  }
}
