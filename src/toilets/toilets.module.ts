import { Module } from '@nestjs/common';
import { ToiletsService } from './toilets.service';
import { ToiletsController } from './toilets.controller';
import { ToiletsGateway } from './toilets.gateway';

@Module({
  controllers: [ToiletsController],
  providers: [ToiletsService, ToiletsGateway],
})
export class ToiletsModule {}
