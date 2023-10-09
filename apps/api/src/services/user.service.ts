import { Inject, Injectable, StreamableFile } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';

import { catchError } from 'rxjs';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';

import {
  UserDelete,
  UserSearch,
  UserUpdate,
  UserUploadFile,
} from '@app/contracts';
import { LocalFileData } from '@app/interfaces';

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
    const user = await this.sendRCPRequest(
      UserSearch.findOneTopic,
      id,
    ).toPromise();
    return user;
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
}
