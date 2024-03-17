import { Module } from '@nestjs/common';
import { EmployeeAccessService } from './employee-access.service';
import { Organization } from 'src/organizations/entities/organization.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Organization])],
  providers: [EmployeeAccessService],
})
export class EmployeeAccessModule {}
