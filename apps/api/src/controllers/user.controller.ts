import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { Response } from 'express';

import { UserService } from '../services/user.service';
import { UserUpdate } from '@app/contracts';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('avatar/:id')
  @UseInterceptors(FileInterceptor('file'))
  async addAvatar(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: '.(png|jpeg|jpg)',
        })
        .addMaxSizeValidator({
          maxSize: 5 * 1024 * 1024,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return this.userService.addAvatar(id, {
      path: file.path,
      filename: file.originalname,
      mimetype: file.mimetype,
    });
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }

  @Get(':id')
  async findUserById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.userService.findUserById(id, response);
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUsetDto: UserUpdate.Request,
  ) {
    return this.userService.updateUser(id, updateUsetDto);
  }

  @Get()
  async findAllUsers() {
    return this.userService.findAllUsers();
  }
}
