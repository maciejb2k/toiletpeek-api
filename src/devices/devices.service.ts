import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { DeviceConnectionDto } from './dto/device-connection.dto';
import { SensorsData } from './types';
import { ToiletsService } from 'src/toilets/toilets.service';

@Injectable()
export class DevicesService {
  constructor(private readonly toiletsService: ToiletsService) {}

  async updateSensorsData(toiletId: string, isOccupied: boolean) {
    return await this.toiletsService.updateOccupancy(toiletId, isOccupied);
  }

  async determineToiletOccupancy(data: SensorsData) {
    const { isDoorOpen } = data;

    // TODO: Some comples AI logic XD

    return isDoorOpen ? true : false;
  }

  async verifyDevice(data: DeviceConnectionDto) {
    const { toiletId, token } = data;

    const toilet = await this.toiletsService.findFromDevice(toiletId);
    if (!toilet) return false;

    const isTokenValid = await bcrypt.compare(token, toilet.token);
    if (!isTokenValid) return false;

    return true;
  }
}
