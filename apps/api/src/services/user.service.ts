import {
  Inject,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';

import { catchError, firstValueFrom } from 'rxjs';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';

import {
  UserCreateOrganizer,
  UserDelete,
  UserSearch,
  UserUpdate,
  UserUploadFile,
} from '@app/contracts';
import { LocalFileData } from '@app/interfaces';
import { FILE_NOT_FOUND_ERROR } from '../constants/user.constants';

const handleRpcError = (error) => {
  throw new RpcException(error.response);
};

@Injectable()
export class UserService {
  constructor(
    @Inject('ACCOUNT_SERVICE') private readonly client: ClientProxy,
  ) {}

  private sendRCPRequest(command: string, data: any) {
    return this.client
      .send({ cmd: command }, data)
      .pipe(catchError(handleRpcError));
  }

  async findUserById(id: number, response: Response) {
    const user = await firstValueFrom(
      this.sendRCPRequest(UserSearch.findOneTopic, id),
    );
    return user;
    if (user.userFile === null) {
      throw new NotFoundException(FILE_NOT_FOUND_ERROR);
    }
    const stream = createReadStream(join(process.cwd(), user.userFile.path));

    response.set({
      'Content-Disposition': `inline; filename="${user.userFile.filename}"`,
      'Content-Type': user.userFile.mimetype,
    });
    return new StreamableFile(stream);
  }

  async addAvatar(id: number, fileData: LocalFileData) {
    return this.sendRCPRequest(UserUploadFile.topic, { id, fileData });
  }

  async findAllUsers() {
    return this.sendRCPRequest(UserSearch.topic, {});
  }

  async deleteUser(id: number) {
    return this.sendRCPRequest(UserDelete.topic, id);
  }

  async updateUser(id: number, updateUserDto: UserUpdate.Request) {
    return this.sendRCPRequest(UserUpdate.topic, { id, updateUserDto });
  }

  async createOrganizer(createOrganizerDto: UserCreateOrganizer.Request) {
    return this.sendRCPRequest(UserCreateOrganizer.topic, createOrganizerDto);
  }
}
