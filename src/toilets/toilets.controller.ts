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

@ApiTags('toilets')
@UseGuards(OrGuard([AuthenticatedGuard, JwtAuthGuard]))
@Controller('toilets')
export class ToiletsController {
  constructor(private readonly toiletsService: ToiletsService) {}

  @Get()
  findAll(@User() user: UserEntity) {
    return this.toiletsService.findAll(user);
  }

  @Get(':id')
  findOne(@User() user: UserEntity, @Param('id', ParseUUIDPipe) id: string) {
    return this.toiletsService.findOne(user, id);
  }

  @Post()
  create(@User() user: UserEntity, @Body() createToiletDto: CreateToiletDto) {
    return this.toiletsService.create(user, createToiletDto);
  }

  @Patch(':id')
  update(
    @User() user: UserEntity,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateToiletDto: UpdateToiletDto,
  ) {
    return this.toiletsService.update(user, id, updateToiletDto);
  }

  @Delete(':id')
  remove(@User() user: UserEntity, @Param('id', ParseUUIDPipe) id: string) {
    return this.toiletsService.remove(user, id);
  }
}
