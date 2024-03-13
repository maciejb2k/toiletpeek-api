import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateRestroomDto } from './dto/create-restroom.dto';
import { UpdateRestroomDto } from './dto/update-restroom.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Restroom } from './entities/restroom.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Organization } from 'src/organizations/entities/organization.entity';
import { RestroomParams } from './dto/restroom.params';

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
    params: RestroomParams,
    createRestroomDto: CreateRestroomDto,
  ) {
    const { organizationId } = params;
    const organization = await this.findOrganization(user, organizationId);

    const restroom = this.restroomRepository
      .createQueryBuilder('restrooms')
      .insert()
      .into(Restroom)
      .values({
        ...createRestroomDto,
        organization,
      })
      .execute();

    return restroom;
  }

  async findAll(user: User, params: RestroomParams) {
    const { organizationId } = params;

    return await this.restroomRepository
      .createQueryBuilder('restrooms')
      .leftJoinAndSelect('restrooms.organization', 'organization')
      .leftJoinAndSelect('organization.user', 'user')
      .where('organization.id = :organizationId', { organizationId })
      .andWhere('user.id = :userId', { userId: user.id })
      .getMany();
  }

  async findOne(user: User, params: RestroomParams, id: string) {
    const { organizationId } = params;

    return await this.restroomRepository
      .createQueryBuilder('restrooms')
      .leftJoinAndSelect('restrooms.organization', 'organization')
      .leftJoinAndSelect('organization.user', 'user')
      .where('restrooms.id = :restroomId', { restroomId: id })
      .andWhere('organization.id = :organizationId', { organizationId })
      .andWhere('user.id = :userId', { userId: user.id })
      .getOneOrFail();
  }

  async update(
    user: User,
    params: RestroomParams,
    id: string,
    updateRestroomDto: UpdateRestroomDto,
  ) {
    const { organizationId } = params;
    await this.findOrganization(user, organizationId);

    return await this.restroomRepository
      .createQueryBuilder('restrooms')
      .update()
      .set(updateRestroomDto)
      .where('id = :id', { id })
      .andWhere('organization.id = :organizationId', {
        organizationId,
      })
      .execute();
  }

  async remove(user: User, params: RestroomParams, id: string) {
    const { organizationId } = params;
    await this.findOrganization(user, organizationId);

    return await this.restroomRepository
      .createQueryBuilder('restrooms')
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
      .createQueryBuilder('organizations')
      .leftJoinAndSelect('organizations.user', 'user')
      .where('organizations.id = :organizationId', { organizationId })
      .andWhere('user.id = :userId', { userId: user.id })
      .getOneOrFail();

    if (organization.user.id !== user.id) {
      throw new UnauthorizedException();
    }

    return organization;
  }
}
