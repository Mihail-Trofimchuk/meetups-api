import { Injectable } from '@nestjs/common';

import { $Enums, User } from '@prisma/client';

import {
  AccountConfirmResponse,
  AccountRegister,
  UserUpdate,
} from '@app/contracts';
import { DbService } from '@app/db';
import { GooglePayload } from '@app/interfaces';

@Injectable()
export class UserRepository {
  constructor(private readonly dbService: DbService) {}

  async create(
    { displayName, email }: AccountRegister.Request,
    passwordHash: string,
  ) {
    return await this.dbService.user.create({
      data: {
        displayName,
        email,
        passwordHash: passwordHash,
      },
    });
  }

  async createGoogleAccount({ email, name }: GooglePayload): Promise<User> {
    return await this.dbService.user.create({
      data: {
        displayName: name,
        email,
      },
    });
  }

  async findAllUsers(): Promise<User[]> {
    return await this.dbService.user.findMany();
  }

  async findUser(email: string): Promise<User> {
    return await this.dbService.user.findFirst({ where: { email } });
  }

  async findUserById(id: number): Promise<User> {
    return await this.dbService.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.dbService.user.findUnique({
      where: {
        email,
      },
    });
  }

  async markEmailAsConfirmed(email: string): Promise<AccountConfirmResponse> {
    return await this.dbService.user.update({
      where: { email },
      data: {
        isEmailConfirmed: true,
      },
    });
  }

  async deleteUser(id: number): Promise<User> {
    return await this.dbService.user.delete({ where: { id } });
  }

  async deleteUserAvatar(email: string): Promise<User> {
    return await this.dbService.user.update({
      where: { email },
      data: { avatarGoogleCloud: null },
    });
  }

  async addGoogleAvatar(fileName: string, userId: number): Promise<string> {
    const user = await this.dbService.user.update({
      where: { id: userId },
      data: {
        avatarGoogleCloud: fileName,
      },
      select: {
        avatarGoogleCloud: true,
      },
    });

    return user.avatarGoogleCloud;
  }

  async updateUser(
    id: number,
    updateDto: UserUpdate.Request,
    passwordHash: string,
  ): Promise<User> {
    return await this.dbService.user.update({
      where: {
        id,
      },
      data: {
        displayName: updateDto.displayName,
        passwordHash,
      },
    });
  }

  async createOrganizer(id: number): Promise<User> {
    return await this.dbService.user.update({
      where: {
        id,
      },
      data: {
        role: $Enums.Role.ORGANIZER,
      },
    });
  }

  // Only local storage use
  // async updateUserAvatar(id: number, fileData: LocalFileData) {
  //   const avatar = await this.filesService.saveLocalFileData(fileData);
  //   return await this.dbService.user.update({
  //     where: { id },
  //     data: {
  //       avatarId: avatar.id,
  //     },
  //   });
  // }
}
