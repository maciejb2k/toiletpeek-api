import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from 'src/organizations/entities/organization.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmployeeAccessService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  async validateEmployee(password: string) {
    const user = await this.organizationRepository
      .createQueryBuilder('organizations')
      .where('organizations.password = :password', { password })
      .getOne();

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    return true;
  }
}
