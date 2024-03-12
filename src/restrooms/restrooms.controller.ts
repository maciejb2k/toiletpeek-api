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

@ApiTags('restrooms')
@UseGuards(OrGuard([AuthenticatedGuard, JwtAuthGuard]))
@Controller('restrooms')
export class RestroomsController {
  constructor(private readonly restroomsService: RestroomsService) {}

  @Get()
  findAll(
    @User() user: UserEntity,
    @Query('organizationId', ParseUUIDPipe) organizationId: string,
  ) {
    return this.restroomsService.findAll(user, organizationId);
  }

  @Get(':id')
  findOne(
    @User() user: UserEntity,
    @Query('organizationId', ParseUUIDPipe) organizationId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.restroomsService.findOne(user, organizationId, id);
  }

  @Post()
  create(
    @User() user: UserEntity,
    @Query('organizationId', ParseUUIDPipe) organizationId: string,
    @Body() createRestroomDto: CreateRestroomDto,
  ) {
    return this.restroomsService.create(
      user,
      organizationId,
      createRestroomDto,
    );
  }

  @Patch(':id')
  update(
    @User() user: UserEntity,
    @Param('id', ParseUUIDPipe) id: string,
    @Query('organizationId', ParseUUIDPipe) organizationId: string,
    @Body() updateRestroomDto: UpdateRestroomDto,
  ) {
    return this.restroomsService.update(
      user,
      id,
      organizationId,
      updateRestroomDto,
    );
  }

  @Delete(':id')
  remove(
    @User() user: UserEntity,
    @Query('organizationId', ParseUUIDPipe) organizationId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.restroomsService.remove(user, organizationId, id);
  }
}
