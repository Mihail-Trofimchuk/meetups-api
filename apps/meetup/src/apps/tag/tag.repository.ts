import { Injectable } from '@nestjs/common';

import { TagCreate, TagDelete, TagSearch } from '@app/contracts';
import { DbService } from '@app/db';

@Injectable()
export class TagRepository {
  constructor(private readonly dbService: DbService) {}

  public async create(
    createTagDto: TagCreate.Request,
  ): Promise<TagCreate.Response> {
    return await this.dbService.tag.create({
      data: { ...createTagDto },
    });
  }

  public async delete(id: number): Promise<TagDelete.Response> {
    return await this.dbService.tag.delete({
      where: { id },
    });
  }

  public async findOneById(id: number): Promise<TagSearch.Response> {
    return await this.dbService.tag.findFirst({
      where: { id },
    });
  }

  public async findOneByName(name: string): Promise<TagSearch.Response> {
    return await this.dbService.tag.findFirst({
      where: { name },
    });
  }

  public async findAll(): Promise<TagSearch.Response[]> {
    return await this.dbService.tag.findMany();
  }

  public async findTagById(tagId: number): Promise<TagSearch.Response> {
    return await this.dbService.tag.findFirst({ where: { id: tagId } });
  }
}
