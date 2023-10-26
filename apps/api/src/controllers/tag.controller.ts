import { TagsResponse } from '@app/contracts';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

import { Observable } from 'rxjs';

import { Role } from '@prisma/client';
import { TagCreateDto } from '../dtos/tag/create-tag.dto';
import { TagService } from '../services/tag.service';
import RoleGuard from '../guards/role.guard';

@ApiTags('tag')
@Controller('tag')
export class TagController {
  constructor(private readonly tagsService: TagService) {}

  @UseGuards(RoleGuard(Role.ADMIN))
  @ApiCreatedResponse({ type: TagsResponse })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createTagDto: TagCreateDto,
  ): Promise<Observable<TagsResponse>> {
    return this.tagsService.createTag(createTagDto);
  }

  @UseGuards(RoleGuard(Role.ADMIN))
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Observable<TagsResponse>> {
    return this.tagsService.removeTag(id);
  }

  @UseGuards(RoleGuard(Role.ADMIN, Role.ORGANIZER))
  @Get()
  findAll(): Promise<Observable<TagsResponse[]>> {
    return this.tagsService.findAllTag();
  }
}
