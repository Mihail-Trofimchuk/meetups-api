import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express';

import { UserService } from '../services/user.service';
import { UserUpdate } from '@app/contracts';

export const storage = {
  storage: diskStorage({
    destination: './uploads/profileimages',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
};

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post('upload/:id')
  // @UseInterceptors(FileInterceptor('file', storage))
  // uploadFile(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Param('id', ParseIntPipe) id: number,
  // ) {
  //   return this.userService.uploadFile(file, id);
  // }

  @Post('avatar/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploadedFiles/avatars',
      }),
    }),
  )
  async addAvatar(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
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
