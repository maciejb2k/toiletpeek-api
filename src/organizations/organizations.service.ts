import { Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  async create(user: User, createOrganizationDto: CreateOrganizationDto) {
    return await this.organizationRepository.insert({
      ...createOrganizationDto,
      user,
    });
  }

  async findAll(user: User) {
    return await this.organizationRepository
      .createQueryBuilder('organization')
      .leftJoinAndSelect('organization.user', 'user')
      .where('user.id = :id', { id: user.id })
      .getMany();
  }

  async findOne(user: User, id: string) {
    return await this.organizationRepository
      .createQueryBuilder('organization')
      .leftJoinAndSelect('organization.user', 'user')
      .where('organization.id = :id', { id })
      .andWhere('user.id = :userId', { userId: user.id })
      .getOneOrFail();
  }

  async update(
    user: User,
    id: string,
    updateOrganizationDto: CreateOrganizationDto,
  ) {
    return await this.organizationRepository
      .createQueryBuilder('organization')
      .update(Organization)
      .set(updateOrganizationDto)
      .where('organization.id = :id', { id })
      .andWhere('user.id = :userId', { userId: user.id })
      .execute();
  }

  async remove(user: User, id: string) {
    return await this.organizationRepository
      .createQueryBuilder('organization')
      .delete()
      .where('organizations.id = :id', { id }) // organizations must be plural XD?
      .andWhere('user.id = :userId', { userId: user.id })
      .execute();
  }
}
