import { Module } from '@nestjs/common';
import { ToiletsService } from './toilets.service';
import { ToiletsController } from './toilets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Toilet } from './entities/toilet.entity';
import { Restroom } from 'src/restrooms/entities/restroom.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Toilet, Restroom])],
  controllers: [ToiletsController],
  providers: [ToiletsService],
})
export class ToiletsModule {}
