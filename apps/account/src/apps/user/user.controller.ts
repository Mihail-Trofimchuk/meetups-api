import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { User } from '@prisma/client';
import {
  UserCreateOrganizer,
  UserDelete,
  UserDeleteGCPFileTopic,
  UserGetGCPFileTopic,
  UserSearch,
  UserUpdate,
  UserUploadGCPFileTopic,
} from '@app/contracts';

import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: UserSearch.Topic })
  async findAllUsers(): Promise<User[]> {
    return this.userService.findAllUsers();
  }

  @MessagePattern({ cmd: UserSearch.OneUserTopic })
  async findUserById(@Payload() id: number) {
    return this.userService.findUserById(id);
  }

  @MessagePattern({ cmd: UserSearch.OneUserByEmailTopic })
  async findUserByEmail(@Payload() email: string): Promise<number> {
    return this.userService.findUserByEmail(email);
  }

  @MessagePattern({ cmd: UserDelete.Topic })
  async deleteUser(@Payload() id: number): Promise<UserDelete.Response> {
    return this.userService.deleteUser(id);
  }

  @MessagePattern({ cmd: UserUpdate.Topic })
  async updateUser(
    @Payload()
    { id, updateUserDto }: { id: number; updateUserDto: UserUpdate.Request },
  ): Promise<UserUpdate.Response> {
    return await this.userService.updateUser(id, updateUserDto);
  }

  @MessagePattern({ cmd: UserCreateOrganizer.Topic })
  async createOrganizer(
    @Payload() createOrganizerDto: UserCreateOrganizer.Request,
  ): Promise<UserCreateOrganizer.Response> {
    return await this.userService.createOrganizer(createOrganizerDto);
  }

  @MessagePattern({ cmd: UserUploadGCPFileTopic })
  async addAvatarGoogle(
    @Payload() { fileName, userId }: { fileName: string; userId: number },
  ) {
    return await this.userService.addAvatarGoogle(fileName, userId);
  }

  @MessagePattern({ cmd: UserGetGCPFileTopic })
  async getAvatar(@Payload() email: string) {
    return await this.userService.downloadFile(email);
  }

  @MessagePattern({ cmd: UserDeleteGCPFileTopic })
  async deleteAvatar(@Payload() email: string) {
    return await this.userService.deleteFile(email);
  }
  // Only local storage use
  // @MessagePattern({ cmd: UserUploadFileTopic })
  // async addAvatar(
  //   @Payload() { id, fileData }: { id: number; fileData: LocalFileData },
  // ): Promise<User> {
  //   return this.userService.addAvatar(id, fileData);
  // }
}
