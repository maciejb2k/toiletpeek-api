import { Injectable } from '@nestjs/common';
import { CreateToiletDto } from './dto/create-toilet.dto';
import { UpdateToiletDto } from './dto/update-toilet.dto';
import { DeviceConnectionDto } from './dto/device-connection.dto';
import { Repository } from 'typeorm';
import { Toilet } from './entities/toilet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';

@Injectable()
export class ToiletsService {
  constructor(
    @InjectRepository(Toilet)
    private readonly toiletRepository: Repository<Toilet>,
  ) {}

  async create(user: User, createToiletDto: CreateToiletDto) {
    return await this.toiletRepository.insert({
      ...createToiletDto,
    });
  }

  async findAll(user: User) {
    const queryBuilder = this.toiletRepository.createQueryBuilder('toilet');

    queryBuilder
      .leftJoinAndSelect('toilet.restroom', 'restroom')
      .leftJoinAndSelect('restroom.organization', 'organization')
      .leftJoinAndSelect('organization.user', 'user')
      .where('user.id = :id', { id: user.id });

    return await queryBuilder.getMany();
  }

  async findOne(user: User, id: string) {
    const queryBuilder = this.toiletRepository.createQueryBuilder('toilet');

    queryBuilder
      .leftJoinAndSelect('toilet.user', 'user')
      .where('toilet.id = :id', { id })
      .andWhere('user.id = :userId', { userId: user.id });

    return await queryBuilder.getOneOrFail();
  }

  async update(user: User, id: string, updateToiletDto: UpdateToiletDto) {
    return await this.toiletRepository.save({ id, user, ...updateToiletDto });
  }

  async remove(user: User, id: string) {
    return await this.toiletRepository.delete({ id });
  }

  verifyDeviceConnection(data: DeviceConnectionDto) {
    const { toiletId, deviceId, token } = data;
    console.log(toiletId, deviceId, token);

    return true;
  }
}
