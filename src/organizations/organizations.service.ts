import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { isObjectEmpty } from 'src/common/utils';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { PageDto } from 'src/common/dto/page.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  async create(user: User, createOrganizationDto: CreateOrganizationDto) {
    return await this.organizationRepository
      .createQueryBuilder('organizations')
      .insert()
      .values({
        ...createOrganizationDto,
        user,
      })
      .execute();
  }

  async findAll({
    user,
    pageOptionsDto,
  }: {
    user: User;
    pageOptionsDto: PageOptionsDto;
  }) {
    const queryBuilder =
      await this.organizationRepository.createQueryBuilder('organizations');

    queryBuilder
      .leftJoin('organizations.user', 'user')
      .where('user.id = :id', { id: user.id })
      .orderBy('organizations.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(user: User, id: string) {
    return await this.organizationRepository
      .createQueryBuilder('organizations')
      .leftJoinAndSelect('organizations.user', 'user')
      .where('organizations.id = :id', { id })
      .andWhere('user.id = :userId', { userId: user.id })
      .getOneOrFail();
  }

  async update(
    user: User,
    id: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ) {
    if (isObjectEmpty(updateOrganizationDto)) {
      throw new BadRequestException('No data to update');
    }

    return await this.organizationRepository
      .createQueryBuilder('organizations')
      .update(Organization)
      .set(updateOrganizationDto)
      .where('organizations.id = :id', { id })
      .andWhere('user.id = :userId', { userId: user.id })
      .execute();
  }

  async remove(user: User, id: string) {
    return await this.organizationRepository
      .createQueryBuilder('organizations')
      .delete()
      .from(Organization)
      .where('organizations.id = :id', { id })
      .andWhere('user.id = :userId', { userId: user.id })
      .execute();
  }
}
