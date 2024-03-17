import { Module } from '@nestjs/common';
import { DevicesGateway } from './devices.gateway';
import { DevicesService } from './devices.service';
import { Toilet } from 'src/toilets/entities/toilet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceAuthGuard } from './guards/device-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Toilet])],
  providers: [DevicesGateway, DevicesService, DeviceAuthGuard],
})
export class DevicesModule {}
