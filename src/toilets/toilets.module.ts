import { Module } from '@nestjs/common';
import { ToiletsService } from './toilets.service';
import { ToiletsController } from './toilets.controller';
import { ToiletsGateway } from './toilets.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Toilet } from './entities/toilet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Toilet])],
  controllers: [ToiletsController],
  providers: [ToiletsService, ToiletsGateway],
})
export class ToiletsModule {}
