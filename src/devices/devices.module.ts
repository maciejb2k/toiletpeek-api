import { Module } from '@nestjs/common';
import { DevicesGateway } from './devices.gateway';
import { DevicesService } from './devices.service';
import { Toilet } from 'src/toilets/entities/toilet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceWsGuard } from './guards/device-ws.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Toilet])],
  providers: [DevicesGateway, DevicesService, DeviceWsGuard],
})
export class DevicesModule {}
