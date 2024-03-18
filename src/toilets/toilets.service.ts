import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateToiletDto } from './dto/create-toilet.dto';
import { UpdateToiletDto } from './dto/update-toilet.dto';
import { Repository } from 'typeorm';
import { Toilet } from './entities/toilet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { ToiletParams } from './dto/toilet.params';
import { Restroom } from 'src/restrooms/entities/restroom.entity';
import * as bcrypt from 'bcrypt';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { PageDto } from 'src/common/dto/page.dto';

@Injectable()
export class ToiletsService {
  constructor(
    @InjectRepository(Toilet)
    private readonly toiletRepository: Repository<Toilet>,
    @InjectRepository(Restroom)
    private readonly restroomRepository: Repository<Restroom>,
  ) {}

  async create(
    user: User,
    params: ToiletParams,
    createToiletDto: CreateToiletDto,
  ) {
    const restroom = await this.findRestroom(user, params);

    const token = await bcrypt.hash(createToiletDto.token, 10);

    const toilet = this.toiletRepository
      .createQueryBuilder('toilet')
      .insert()
      .into(Toilet)
      .values({
        ...createToiletDto,
        token,
        restroom,
      })
      .execute();

    return toilet;
  }

  async findAll({
    user,
    pageOptionsDto,
    params,
  }: {
    user: User;
    pageOptionsDto: PageOptionsDto;
    params: ToiletParams;
  }) {
    const { organizationId, restroomId } = params;

    const queryBuilder =
      await this.toiletRepository.createQueryBuilder('toilet');

    queryBuilder
      .leftJoin('toilet.restroom', 'restroom')
      .leftJoin('restroom.organization', 'organization')
      .leftJoin('organization.user', 'user')
      .where('organization.id = :organizationId', { organizationId })
      .andWhere('restroom.id = :restroomId', { restroomId })
      .andWhere('user.id = :userId', { userId: user.id })
      .orderBy('toilet.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(user: User, params: ToiletParams, id: string) {
    const restroom = await this.findRestroom(user, params);

    return await this.toiletRepository
      .createQueryBuilder('toilet')
      .where('toilet.id = :id', { id })
      .andWhere('toilet.restroomId = :restroomId', { restroomId: restroom.id })
      .getOneOrFail();
  }

  async findFromDevice(toiletId: string) {
    return await this.toiletRepository
      .createQueryBuilder('toilet')
      .where('toilet.id = :id', { id: toiletId })
      .getOneOrFail();
  }

  async getOrganizationId(toiletId: string) {
    const toilet = await this.toiletRepository
      .createQueryBuilder('toilet')
      .leftJoinAndSelect('toilet.restroom', 'restroom')
      .leftJoinAndSelect('restroom.organization', 'organization')
      .where('toilet.id = :id', { id: toiletId })
      .getOneOrFail();

    return toilet.restroom.organization.id;
  }

  async update(
    user: User,
    params: ToiletParams,
    id: string,
    updateToiletDto: UpdateToiletDto,
  ) {
    const { restroomId } = params;
    await this.findRestroom(user, params);

    return await this.toiletRepository
      .createQueryBuilder('toilets')
      .update()
      .set(updateToiletDto)
      .where('id = :id', { id })
      .andWhere('restroom.id = :restroomId', {
        restroomId,
      })
      .execute();
  }

  async updateOccupancy(toiletId: string, isOccupied: boolean) {
    return await this.toiletRepository
      .createQueryBuilder('toilets')
      .update()
      .set({ isOccupied })
      .where('id = :id', { id: toiletId })
      .execute();
  }

  async remove(user: User, params: ToiletParams, id: string) {
    const { restroomId } = params;
    await this.findRestroom(user, params);

    return await this.toiletRepository
      .createQueryBuilder('toilets')
      .delete()
      .from(Toilet)
      .where('id = :id', { id })
      .andWhere('restroom.id = :restroomId', {
        restroomId,
      })
      .execute();
  }

  private async findRestroom(user: User, params: ToiletParams) {
    const { organizationId, restroomId } = params;

    const restroom = await this.restroomRepository
      .createQueryBuilder('restroom')
      .leftJoinAndSelect('restroom.organization', 'organization')
      .leftJoinAndSelect('organization.user', 'user')
      .where('user.id = :id', { id: user.id })
      .andWhere('organization.id = :organizationId', { organizationId })
      .andWhere('restroom.id = :restroomId', { restroomId })
      .getOneOrFail();

    if (restroom.organization.user.id !== user.id) {
      throw new UnauthorizedException();
    }

    return restroom;
  }
}
