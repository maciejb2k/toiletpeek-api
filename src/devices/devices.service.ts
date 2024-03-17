import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { Toilet } from 'src/toilets/entities/toilet.entity';
import { DeviceConnectionDto } from './dto/device-connection.dto';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Toilet)
    private readonly toiletRepository: Repository<Toilet>,
  ) {}

  async verifyDevice(data: DeviceConnectionDto) {
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
}
