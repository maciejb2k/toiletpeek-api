import { Injectable } from '@nestjs/common';
import { CreateToiletDto } from './dto/create-toilet.dto';
import { UpdateToiletDto } from './dto/update-toilet.dto';
import { DeviceConnectionDto } from './dto/device-connection.dto';

@Injectable()
export class ToiletsService {
  create(createToiletDto: CreateToiletDto) {
    return 'This action adds a new toilet';
  }

  findAll() {
    return `This action returns all toilets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} toilet`;
  }

  update(id: number, updateToiletDto: UpdateToiletDto) {
    return `This action updates a #${id} toilet`;
  }

  remove(id: number) {
    return `This action removes a #${id} toilet`;
  }

  verifyDeviceConnection(data: DeviceConnectionDto) {
    const { toiletId, deviceId, token } = data;
    return false;
  }
}
