import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { Observable, catchError } from 'rxjs';

import { TagCreate, TagDelete, TagSearch, TagsResponse } from '@app/contracts';
import { TagCreateDto } from '../dtos/tag/create-tag.dto';
import { handleRpcError } from '../filters/rpc.exception';

@Injectable()
export class TagService {
  constructor(@Inject('MEETUP_SERVICE') private readonly client: ClientProxy) {}

  private sendRCPRequest(command: string, data: any) {
    return this.client
      .send({ cmd: command }, data)
      .pipe(catchError(handleRpcError));
  }

  public async createTag(
    createTagDto: TagCreateDto,
  ): Promise<Observable<TagsResponse>> {
    return this.sendRCPRequest(TagCreate.Topic, createTagDto);
  }

  public async removeTag(id: number): Promise<Observable<TagsResponse>> {
    return this.sendRCPRequest(TagDelete.Topic, id);
  }

  public async findAllTag(): Promise<Observable<TagsResponse[]>> {
    return this.sendRCPRequest(TagSearch.Topic, {});
  }
}
