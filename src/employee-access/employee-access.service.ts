import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from 'src/organizations/entities/organization.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmployeeAccessService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    private jwtService: JwtService,
  ) {}

  async signIn(organization: Organization) {
    const payload = { sub: organization.id };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
    };
  }

  async validateEmployee(organizationId: string, password: string) {
    const organization = await this.organizationRepository
      .createQueryBuilder('organizations')
      .where('organizations.password = :password', { password })
      .andWhere('organizations.id = :organizationId', { organizationId })
      .getOne();

    if (!organization) {
      throw new BadRequestException('Invalid credentials');
    }

    return organization;
  }
}
