import { Body, Controller, Delete, Get, Headers, Param, Patch, Post } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { getCurrentUserFromHeaders } from '../../common/http/current-user';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  create(@Body() dto: CreateTagDto, @Headers() headers: Record<string, unknown>) {
    const currentUser = getCurrentUserFromHeaders(headers);
    return this.tagsService.create(dto, currentUser.role);
  }

  @Get()
  findAll() {
    return this.tagsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagsService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTagDto, @Headers() headers: Record<string, unknown>) {
    const currentUser = getCurrentUserFromHeaders(headers);
    return this.tagsService.update(Number(id), dto, currentUser.role);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Headers() headers: Record<string, unknown>) {
    const currentUser = getCurrentUserFromHeaders(headers);
    return this.tagsService.remove(Number(id), currentUser.role);
  }
}

