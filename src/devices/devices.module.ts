import { Module } from '@nestjs/common';
import { DevicesGateway } from './devices.gateway';
import { DevicesService } from './devices.service';
import { DeviceWsGuard } from './guards/device-ws.guard';
import { ToiletsModule } from 'src/toilets/toilets.module';

@Module({
  imports: [ToiletsModule],
  providers: [DevicesGateway, DevicesService, DeviceWsGuard],
})
export class DevicesModule {}
