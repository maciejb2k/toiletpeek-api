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
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { ToiletsService } from './toilets.service';
import { CreateToiletDto } from './dto/create-toilet.dto';
import { UpdateToiletDto } from './dto/update-toilet.dto';
import { ApiTags } from '@nestjs/swagger';
import { OrGuard } from '@nest-lab/or-guard';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/common/decorators';
import { User as UserEntity } from 'src/users/user.entity';
import { ToiletParams } from './dto/toilet.params';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';

@ApiTags('toilets')
@UseGuards(OrGuard([AuthenticatedGuard, JwtAuthGuard]))
@UseInterceptors(ClassSerializerInterceptor)
@Controller('toilets')
export class ToiletsController {
  constructor(private readonly toiletsService: ToiletsService) {}

  @Get()
  findAll(
    @User() user: UserEntity,
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() params: ToiletParams,
  ) {
    return this.toiletsService.findAll({ user, pageOptionsDto, params });
  }

  @Get(':id')
  findOne(
    @User() user: UserEntity,
    @Query() params: ToiletParams,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.toiletsService.findOne(user, params, id);
  }

  @Post()
  create(
    @User() user: UserEntity,
    @Query() params: ToiletParams,
    @Body() createToiletDto: CreateToiletDto,
  ) {
    return this.toiletsService.create(user, params, createToiletDto);
  }

  @Patch(':id')
  update(
    @User() user: UserEntity,
    @Query() params: ToiletParams,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateToiletDto: UpdateToiletDto,
  ) {
    return this.toiletsService.update(user, params, id, updateToiletDto);
  }

  @Delete(':id')
  remove(
    @User() user: UserEntity,
    @Query() params: ToiletParams,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.toiletsService.remove(user, params, id);
  }
}
