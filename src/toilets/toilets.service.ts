import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateToiletDto } from './dto/create-toilet.dto';
import { UpdateToiletDto } from './dto/update-toilet.dto';
import { DeviceConnectionDto } from './dto/device-connection.dto';
import { Repository } from 'typeorm';
import { Toilet } from './entities/toilet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { ToiletParams } from './dto/toilet.params';
import { Restroom } from 'src/restrooms/entities/restroom.entity';
import * as bcrypt from 'bcrypt';

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

  async findAll(user: User, params: ToiletParams) {
    const restroom = await this.findRestroom(user, params);

    return await this.toiletRepository
      .createQueryBuilder('toilet')
      .andWhere('toilet.restroomId = :restroomId', { restroomId: restroom.id })
      .getMany();
  }

  async findOne(user: User, params: ToiletParams, id: string) {
    const restroom = await this.findRestroom(user, params);

    return await this.toiletRepository
      .createQueryBuilder('toilet')
      .where('toilet.id = :id', { id })
      .andWhere('toilet.restroomId = :restroomId', { restroomId: restroom.id })
      .getOneOrFail();
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

  async verifyDeviceConnection(data: DeviceConnectionDto) {
    const { toiletId, token } = data;

    const toilet = await this.toiletRepository
      .createQueryBuilder('toilet')
      .where('toilet.id = :toiletId', { toiletId })
      .getOne();

    if (!toilet) return false;

    const isTokenValid = await bcrypt.compare(token, toilet.token);

    if (!isTokenValid) return false;

    return true;
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
