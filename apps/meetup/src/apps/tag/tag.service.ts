import { RpcException } from '@nestjs/microservices';
import { ConflictException, Injectable } from '@nestjs/common';

import { MeetupTags, TagCreate, TagDelete, TagSearch } from '@app/contracts';
import { TagRepository } from './tag.repository';
import { ERROR_MESSAGES } from './tag.constants';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  async deleteTag(id: number): Promise<TagDelete.Response> {
    const tag = await this.tagRepository.findOneById(id);
    if (!tag) {
      throw new RpcException(
        new ConflictException(ERROR_MESSAGES.TAG_NOT_FOUND_ERROR),
      );
    }
    return await this.tagRepository.delete(id);
  }

  async searchTag(): Promise<TagSearch.Response[]> {
    return await this.tagRepository.findAll();
  }

  async searchTagById(tagId: number): Promise<TagSearch.Response> {
    return await this.tagRepository.findTagById(tagId);
  }

  async findAllTagById(tags: MeetupTags[]) {
    const allTags = [];
    for (const tag of tags) {
      const element = await this.searchTagById(tag.tagId);
      allTags.push(element);
    }
    return allTags;
  }

  async createTag(
    createContract: TagCreate.Request,
  ): Promise<TagCreate.Response> {
    const tag = await this.tagRepository.findOneByName(createContract.name);

    if (tag) {
      throw new RpcException(
        new ConflictException(ERROR_MESSAGES.TAG_ALREADY_EXISTS),
      );
    }
    return await this.tagRepository.create(createContract);
  }
}
