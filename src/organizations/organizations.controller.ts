import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Delete,
  Param,
  ParseUUIDPipe,
  Patch,
  ClassSerializerInterceptor,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { User } from 'src/common/decorators';
import { User as UserEntity } from 'src/users/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { OrGuard } from '@nest-lab/or-guard';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { Organization } from './entities/organization.entity';

@ApiTags('organizations')
@UseGuards(OrGuard([AuthenticatedGuard, JwtAuthGuard]))
@UseInterceptors(ClassSerializerInterceptor)
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  create(
    @User() user: UserEntity,
    @Body() createOrganizationDto: CreateOrganizationDto,
  ) {
    return this.organizationsService.create(user, createOrganizationDto);
  }

  @Get()
  findAll(
    @User() user: UserEntity,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Organization>> {
    return this.organizationsService.findAll({ user, pageOptionsDto });
  }

  @Get(':id')
  findOne(@User() user: UserEntity, @Param('id', ParseUUIDPipe) id: string) {
    return this.organizationsService.findOne(user, id);
  }

  @Patch(':id')
  update(
    @User() user: UserEntity,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationsService.update(user, id, updateOrganizationDto);
  }

  @Delete(':id')
  remove(@User() user: UserEntity, @Param('id', ParseUUIDPipe) id: string) {
    return this.organizationsService.remove(user, id);
  }
}
