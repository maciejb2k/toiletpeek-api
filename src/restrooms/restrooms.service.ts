import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateRestroomDto } from './dto/create-restroom.dto';
import { UpdateRestroomDto } from './dto/update-restroom.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Restroom } from './entities/restroom.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Organization } from 'src/organizations/entities/organization.entity';

@Injectable()
export class RestroomsService {
  constructor(
    @InjectRepository(Restroom)
    private readonly restroomRepository: Repository<Restroom>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  async create(
    user: User,
    organizationId: string,
    createRestroomDto: CreateRestroomDto,
  ) {
    const organization = await this.findOrganization(user, organizationId);

    const restroom = this.restroomRepository
      .createQueryBuilder('restroom')
      .insert()
      .into(Restroom)
      .values({
        ...createRestroomDto,
        organization,
      })
      .execute();

    return restroom;
  }

  async findAll(user: User, organizationId: string) {
    return await this.restroomRepository
      .createQueryBuilder('restroom')
      .leftJoinAndSelect('restroom.organization', 'organization')
      .leftJoinAndSelect('organization.user', 'user')
      .where('organization.id = :organizationId', { organizationId })
      .andWhere('user.id = :userId', { userId: user.id })
      .getMany();
  }

  async findOne(user: User, organizationId: string, id: string) {
    return await this.restroomRepository
      .createQueryBuilder('restroom')
      .leftJoinAndSelect('restroom.organization', 'organization')
      .leftJoinAndSelect('organization.user', 'user')
      .where('restroom.id = :restroomId', { restroomId: id })
      .andWhere('organization.id = :organizationId', { organizationId })
      .andWhere('user.id = :userId', { userId: user.id })
      .getOneOrFail();
  }

  async update(
    user: User,
    organizationId: string,
    id: string,
    updateRestroomDto: UpdateRestroomDto,
  ) {
    await this.findOrganization(user, organizationId);

    return await this.restroomRepository
      .createQueryBuilder('restroom')
      .update()
      .set(updateRestroomDto)
      .where('id = :id', { id })
      .andWhere('organization.id = :organizationId', {
        organizationId,
      })
      .execute();
  }

  async remove(user: User, organizationId: string, id: string) {
    await this.findOrganization(user, organizationId);

    return await this.restroomRepository
      .createQueryBuilder('restroom')
      .delete()
      .from(Restroom)
      .where('id = :id', { id })
      .andWhere('organization.id = :organizationId', {
        organizationId,
      })
      .execute();
  }

  async findOrganization(user: User, organizationId: string) {
    const organization = await this.organizationRepository
      .createQueryBuilder('organization')
      .leftJoinAndSelect('organization.user', 'user')
      .where('organization.id = :organizationId', { organizationId })
      .andWhere('user.id = :userId', { userId: user.id })
      .getOneOrFail();

    if (organization.user.id !== user.id) {
      throw new UnauthorizedException();
    }

    return organization;
  }
}
