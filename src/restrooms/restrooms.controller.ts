import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { RestroomsService } from './restrooms.service';
import { CreateRestroomDto } from './dto/create-restroom.dto';
import { UpdateRestroomDto } from './dto/update-restroom.dto';
import { ApiTags } from '@nestjs/swagger';
import { OrGuard } from '@nest-lab/or-guard';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User as UserEntity } from 'src/users/user.entity';
import { User } from 'src/common/decorators';
import { RestroomParams } from './dto/restroom.params';

@ApiTags('restrooms')
@UseGuards(OrGuard([AuthenticatedGuard, JwtAuthGuard]))
@Controller('restrooms')
export class RestroomsController {
  constructor(private readonly restroomsService: RestroomsService) {}

  @Get()
  findAll(@User() user: UserEntity, @Query() params: RestroomParams) {
    return this.restroomsService.findAll(user, params);
  }

  @Get(':id')
  findOne(
    @User() user: UserEntity,
    @Query() params: RestroomParams,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.restroomsService.findOne(user, params, id);
  }

  @Post()
  create(
    @User() user: UserEntity,
    @Query() params: RestroomParams,
    @Body() createRestroomDto: CreateRestroomDto,
  ) {
    return this.restroomsService.create(user, params, createRestroomDto);
  }

  @Patch(':id')
  update(
    @User() user: UserEntity,
    @Param('id', ParseUUIDPipe) id: string,
    @Query() params: RestroomParams,
    @Body() updateRestroomDto: UpdateRestroomDto,
  ) {
    return this.restroomsService.update(user, params, id, updateRestroomDto);
  }

  @Delete(':id')
  remove(
    @User() user: UserEntity,
    @Query() params: RestroomParams,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.restroomsService.remove(user, params, id);
  }
}
