import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { TagCreate, TagDelete, TagSearch } from '@app/contracts';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @MessagePattern({ cmd: TagCreate.Topic })
  async createMeetup(
    @Payload() createContract: TagCreate.Request,
  ): Promise<TagCreate.Response> {
    return this.tagService.createTag(createContract);
  }

  @MessagePattern({ cmd: TagDelete.Topic })
  async deleteMeetup(@Payload() id: number): Promise<TagCreate.Response> {
    return this.tagService.deleteTag(id);
  }

  @MessagePattern({ cmd: TagSearch.Topic })
  async searchMeetup(): Promise<TagCreate.Response[]> {
    return this.tagService.searchTag();
  }
}
