import { Injectable, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

import { Storage } from '@google-cloud/storage';
import { genSalt, hash } from 'bcryptjs';

import { UserCreateOrganizer, UserDelete, UserUpdate } from '@app/contracts';
import { User } from '@prisma/client';

import {
  USER_EMAIL_NOT_FOUND_ERROR,
  USER_NOT_FOUND_ERROR,
} from './user.constants';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private storage: Storage;
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {
    const projectId = this.configService.get('GOOGLE_PROJECT_ID');
    const keyFilename = this.configService.get('GOOGLE_KEY');
    this.storage = new Storage({
      projectId,
      keyFilename,
    });
  }

  private async checkUserExists(id: number): Promise<User> {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new RpcException(new NotFoundException(USER_NOT_FOUND_ERROR));
    }
    return user;
  }

  async updateUser(
    id: number,
    updateDto: UserUpdate.Request,
  ): Promise<UserUpdate.Response> {
    await this.checkUserExists(id);

    const salt = await genSalt(10);
    const hashedPassword = await hash(updateDto.password, salt);
    return await this.userRepository.updateUser(id, updateDto, hashedPassword);
  }

  async findAllUsers(): Promise<User[]> {
    return await this.userRepository.findAllUsers();
  }

  async findUserById(id: number) {
    const user = await this.checkUserExists(id);
    // Only local storage use
    // const userFile =
    //   user.avatarId !== null
    //     ? await this.filesService.getFileById(user.avatarId)
    //     : null;
    return user;
  }

  async findUserByEmail(email: string): Promise<number> {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new RpcException(new NotFoundException(USER_NOT_FOUND_ERROR));
    }
    return user.id;
  }

  async deleteUser(id: number): Promise<UserDelete.Response> {
    await this.checkUserExists(id);

    return await this.userRepository.deleteUser(id);
  }

  async createOrganizer(
    createOrganizerDto: UserCreateOrganizer.Request,
  ): Promise<UserCreateOrganizer.Response> {
    const user = await this.userRepository.findUserByEmail(
      createOrganizerDto.email,
    );

    if (!user) {
      throw new RpcException(new NotFoundException(USER_EMAIL_NOT_FOUND_ERROR));
    }

    return await this.userRepository.createOrganizer(user.id);
  }

  async addAvatarGoogle(fileName: string, userId: number): Promise<string> {
    return await this.userRepository.addGoogleAvatar(fileName, userId);
  }

  async downloadFile(email: string): Promise<string> {
    const user = await this.userRepository.findUserByEmail(email);
    return user.avatarGoogleCloud;
  }

  async deleteFile(email: string): Promise<User> {
    return await this.userRepository.deleteUserAvatar(email);
  }

  // Only local storage use
  // async addAvatar(id: number, fileData: LocalFileData): Promise<User> {
  //   await this.checkUserExists(id);

  //   return await this.userRepository.updateUserAvatar(id, fileData);
  // }
}
