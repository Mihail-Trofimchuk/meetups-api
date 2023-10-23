import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { Response } from 'express';
import { Observable } from 'rxjs';

import { Role, User } from '@prisma/client';
import { MeetupRequestUser } from '@app/interfaces';
import { UserUpdateDto } from '../dtos/user/update-user.dto';
import { UserCreateOrganizerDto } from '../dtos/user/user-create-organizer.dto';
import RoleGuard from '../guards/role.guard';
import { UserService } from '../services/user.service';
import { DeleteAvatarResponse } from '../response/user/delete-avatar.response';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @UseGuards(RoleGuard(Role.ADMIN))
  @Delete(':id')
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Observable<User>> {
    return this.userService.deleteUser(id);
  }

  // @UseGuards(RoleGuard(Role.ADMIN, Role.ORGANIZER))
  @Get(':id')
  async findUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.findById(id);
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUsetDto: UserUpdateDto,
  ): Promise<Observable<User>> {
    return this.userService.updateUser(id, updateUsetDto);
  }

  @Get()
  async findAllUsers(): Promise<Observable<User[]>> {
    return this.userService.findAllUsers();
  }

  // @UseGuards(RoleGuard(Role.ADMIN))
  @Post('create-organizer')
  async createOrganizer(
    @Body() createOrganizerDto: UserCreateOrganizerDto,
  ): Promise<Observable<User>> {
    return this.userService.createOrganizer(createOrganizerDto);
  }

  @UseGuards(RoleGuard(Role.PARTICIPANT, Role.ORGANIZER, Role.ADMIN))
  @Post('upload/google')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() { user }: MeetupRequestUser,
    @Res() response: Response,
  ): Promise<string> {
    return await this.userService.addGoogleAvatar(file, user.id, response);
  }

  @UseGuards(RoleGuard(Role.PARTICIPANT, Role.ORGANIZER, Role.ADMIN))
  @Get('download/google')
  async downloadAvatar(@Req() { user }: MeetupRequestUser): Promise<string> {
    return await this.userService.getGoogleAvatar(user.email);
  }

  @UseGuards(RoleGuard(Role.PARTICIPANT, Role.ORGANIZER, Role.ADMIN))
  @Delete('delete/google')
  async deleteAvatar(
    @Req() { user }: MeetupRequestUser,
  ): Promise<DeleteAvatarResponse> {
    return await this.userService.deleteGoogleAvatar(user.email);
  }

  // Only local storage use
  // @Post('avatar/:id')
  // @UseInterceptors(FileInterceptor('file'))
  // async addAvatar(
  //   @Param('id', ParseIntPipe) id: number,
  //   @UploadedFile(
  //     new ParseFilePipeBuilder()
  //       .addFileTypeValidator({
  //         fileType: '.(png|jpeg|jpg)',
  //       })
  //       .addMaxSizeValidator({
  //         maxSize: 5 * 1024 * 1024,
  //       })
  //       .build({
  //         errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  //       }),
  //   )
  //   file: Express.Multer.File,
  // ) {
  //   return this.userService.addAvatar(id, {
  //     path: file.path,
  //     filename: file.originalname,
  //     mimetype: file.mimetype,
  //   });
  // }
}
