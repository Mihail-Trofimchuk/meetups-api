import { Injectable, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { genSalt, hash } from 'bcryptjs';

import { LocalFileData } from '@app/interfaces';
import { UserCreateOrganizer, UserDelete, UserUpdate } from '@app/contracts';
import { UserRepository } from './user.repository';
import { FilesService } from '../files/files.service';
import { USER_NOT_FOUND_ERROR } from './user.constants';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly filesService: FilesService,
  ) {}

  private async checkUserExists(id: number) {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new RpcException(new NotFoundException(USER_NOT_FOUND_ERROR));
    }
    return user;
  }

  async updateUser(id: number, updateDto: UserUpdate.Request) {
    await this.checkUserExists(id);

    const salt = await genSalt(10);
    const hashedPassword = await hash(updateDto.password, salt);
    return await this.userRepository.updateUser(id, updateDto, hashedPassword);
  }

  async addAvatar(id: number, fileData: LocalFileData) {
    await this.checkUserExists(id);

    return await this.userRepository.updateUserAvatar(id, fileData);
  }

  async findAllUsers() {
    return await this.userRepository.findAllUsers();
  }

  async findUserById(id: number) {
    const user = await this.checkUserExists(id);
    const userFile =
      user.avatarId !== null
        ? await this.filesService.getFileById(user.avatarId)
        : null;
    return { user, userFile };
  }

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findUserByEmail(email);
    return user.id;
  }

  async deleteUser(id: number): Promise<UserDelete.Response> {
    await this.checkUserExists(id);

    return await this.userRepository.deleteUser(id);
  }

  async createOrganizer(createOrganizerDto: UserCreateOrganizer.Request) {
    const user = await this.userRepository.findUserByEmail(
      createOrganizerDto.email,
    );
    if (!user) {
      throw new RpcException(new NotFoundException(USER_NOT_FOUND_ERROR));
    }

    return await this.userRepository.createOrganizer(user.id);
  }
}
