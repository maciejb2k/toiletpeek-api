import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LocalEmployeeAuthGuard } from './guards/local-employee-auth.guard';
import { User as Organization } from 'src/common/decorators';
import { EmployeeAccessService } from './employee-access.service';
import { Organization as OrganizationEntity } from 'src/organizations/entities/organization.entity';
import { JwtEmployeeAuthGuard } from './guards/jwt-employee-auth.guard';

@ApiTags('employee-access')
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
  async findRestrooms() {
    return 'Restrooms';
  }
}
