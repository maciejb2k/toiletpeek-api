import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ToiletsService } from './toilets.service';
import { CreateToiletDto } from './dto/create-toilet.dto';
import { UpdateToiletDto } from './dto/update-toilet.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('toilets')
@Controller('toilets')
export class ToiletsController {
  constructor(private readonly toiletsService: ToiletsService) {}

  @Post()
  create(@Body() createToiletDto: CreateToiletDto) {
    return this.toiletsService.create(createToiletDto);
  }

  @Get()
  findAll() {
    return this.toiletsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.toiletsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateToiletDto: UpdateToiletDto) {
    return this.toiletsService.update(+id, updateToiletDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.toiletsService.remove(+id);
  }
}
