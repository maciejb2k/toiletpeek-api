import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Delete,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { User } from 'src/common/decorators';
import { User as UserEntity } from 'src/users/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { OrGuard } from '@nest-lab/or-guard';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('organizations')
@UseGuards(OrGuard([AuthenticatedGuard, JwtAuthGuard]))
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
  findAll(@User() user: UserEntity) {
    return this.organizationsService.findAll(user);
  }

  @Delete(':id')
  remove(@User() user: UserEntity, @Param('id', ParseUUIDPipe) id: string) {
    return this.organizationsService.remove(user, id);
  }
}
