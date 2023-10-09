import { Injectable } from '@nestjs/common';

import { $Enums } from '@prisma/client';

import { AccountRegister, UserUpdate } from '@app/contracts';
import { DbService } from '@app/db';
import { GooglePayload, LocalFileData } from '@app/interfaces';
import { FilesService } from '../files/files.service';

@Injectable()
export class UserRepository {
  constructor(
    private readonly dbService: DbService,
    private filesService: FilesService,
  ) {}

  async create(
    { displayName, email }: AccountRegister.Request,
    passwordHash: string,
  ) {
    return await this.dbService.user.create({
      data: {
        displayName,
        email,
        role: $Enums.Role.USER,
        passwordHash: passwordHash,
      },
    });
  }

  async createGoogleAccount({ email, name }: GooglePayload) {
    return await this.dbService.user.create({
      data: {
        displayName: name,
        email,
        role: $Enums.Role.USER,
      },
    });
  }

  async findAllUsers() {
    return await this.dbService.user.findMany();
  }

  async findUser(email: string) {
    return await this.dbService.user.findFirst({ where: { email } });
  }

  async findUserById(id: number) {
    return await this.dbService.user.findUnique({
      where: {
        id,
      },
    });
  }

  async deleteUser(id: number) {
    return await this.dbService.user.delete({ where: { id } });
  }

  async updateUserAvatar(id: number, fileData: LocalFileData) {
    const avatar = await this.filesService.saveLocalFileData(fileData);
    return this.dbService.user.update({
      where: { id },
      data: {
        avatarId: avatar.id,
      },
    });
  }

  async updateUser(
    id: number,
    updateDto: UserUpdate.Request,
    passwordHash: string,
  ) {
    return this.dbService.user.update({
      where: {
        id,
      },
      data: {
        displayName: updateDto.displayName,
        passwordHash,
      },
    });
  }
}
