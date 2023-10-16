import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import {
  UserCreateOrganizer,
  UserDelete,
  UserSearch,
  UserUpdate,
  UserUploadFile,
} from '@app/contracts';
import { LocalFileData } from '@app/interfaces';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: UserUploadFile.topic })
  async addAvatar(
    @Payload() { id, fileData }: { id: number; fileData: LocalFileData },
  ) {
    return this.userService.addAvatar(id, fileData);
  }

  @MessagePattern({ cmd: UserSearch.topic })
  async findAllUsers() {
    return this.userService.findAllUsers();
  }

  @MessagePattern({ cmd: UserSearch.findOneTopic })
  async findUserById(@Payload() id: number) {
    return this.userService.findUserById(id);
  }

  @MessagePattern({ cmd: UserSearch.findOneByEmailTopic })
  async findUserByEmail(@Payload() email: string) {
    return this.userService.findUserByEmail(email);
  }

  @MessagePattern({ cmd: UserDelete.topic })
  async deleteUser(@Payload() id: number): Promise<UserDelete.Response> {
    return this.userService.deleteUser(id);
  }

  @MessagePattern({ cmd: UserUpdate.topic })
  async updateUser(
    @Payload()
    { id, updateUserDto }: { id: number; updateUserDto: UserUpdate.Request },
  ) {
    return await this.userService.updateUser(id, updateUserDto);
  }

  @MessagePattern({ cmd: UserCreateOrganizer.topic })
  async createOrganizer(
    @Payload() createOrganizerDto: UserCreateOrganizer.Request,
  ) {
    return await this.userService.createOrganizer(createOrganizerDto);
  }
}
