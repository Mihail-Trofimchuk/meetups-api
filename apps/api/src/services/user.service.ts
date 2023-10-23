import { ClientProxy } from '@nestjs/microservices';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { Bucket } from '@google-cloud/storage';
import { Response } from 'express';
import { Observable, catchError, firstValueFrom } from 'rxjs';

import {
  UserCreateOrganizer,
  UserDelete,
  UserDeleteGCPFileTopic,
  UserGetGCPFileTopic,
  UserSearch,
  UserUpdate,
  UserUploadGCPFileTopic,
} from '@app/contracts';
import { User } from '@prisma/client';

import { UserUpdateDto } from '../dtos/user/update-user.dto';
import { UserCreateOrganizerDto } from '../dtos/user/user-create-organizer.dto';
import { handleRpcError } from '../filters/rpc.exception';
import { GoogleCloudService } from '../utils/google-cloud';
import {
  ERROR_MESSAGES,
  EXPIRES,
  INFO_MESSAGES,
} from '../constants/user.constants';
import { DeleteAvatarResponse } from '../response/user/delete-avatar.response';

@Injectable()
export class UserService {
  constructor(
    @Inject('ACCOUNT_SERVICE') private readonly client: ClientProxy,
    private readonly googleCloudService: GoogleCloudService,
  ) {}

  private sendRCPRequest(command: string, data: any) {
    return this.client
      .send({ cmd: command }, data)
      .pipe(catchError(handleRpcError));
  }

  async findById(id: number): Promise<User> {
    const user = await firstValueFrom(
      this.sendRCPRequest(UserSearch.OneUserTopic, id),
    );
    return user;
    // Only local storage
    // if (user.userFile === null) {
    //   throw new NotFoundException(FILE_NOT_FOUND_ERROR);
    // }
    // const stream = createReadStream(join(process.cwd(), user.userFile.path));

    // response.set({
    //   'Content-Disposition': `inline; filename="${user.userFile.filename}"`,
    //   'Content-Type': user.userFile.mimetype,
    // });
    // return new StreamableFile(stream);
  }

  async addGoogleAvatar(
    file: Express.Multer.File,
    userId: number,
    response: Response,
  ): Promise<string> {
    file.originalname = `${userId}_${file.originalname}`;
    const fileName = file.originalname;

    await firstValueFrom(
      this.sendRCPRequest(UserUploadGCPFileTopic, {
        fileName,
        userId,
      }),
    );
    this.googleCloudService.upload(file, response);
    return;
  }

  async getGoogleAvatar(email: string): Promise<string> {
    const avatarGoogleCloud = await this.getAvatarLocation(email);
    const bucket = this.googleCloudService.getBucket();

    if (await this.fileExists(bucket, avatarGoogleCloud)) {
      return this.getSignedUrl(bucket, avatarGoogleCloud);
    } else {
      throw new NotFoundException(ERROR_MESSAGES.FILE_EMAIL_NOT_FOUND);
    }
  }

  async deleteGoogleAvatar(email: string): Promise<DeleteAvatarResponse> {
    const avatarGoogleCloud = await this.getAvatarLocation(email);
    const bucket = this.googleCloudService.getBucket();
    if (await this.fileExists(bucket, avatarGoogleCloud)) {
      await firstValueFrom(this.sendRCPRequest(UserDeleteGCPFileTopic, email));
      await this.deleteFile(bucket, avatarGoogleCloud);
      return { message: INFO_MESSAGES.FILE_DELETED_SUCCESSFULLY };
    } else {
      throw new NotFoundException(ERROR_MESSAGES.FILE_EMAIL_NOT_FOUND);
    }
  }

  async findAllUsers(): Promise<Observable<User[]>> {
    return this.sendRCPRequest(UserSearch.Topic, {});
  }

  async deleteUser(id: number): Promise<Observable<User>> {
    return this.sendRCPRequest(UserDelete.Topic, id);
  }

  async updateUser(
    id: number,
    updateUserDto: UserUpdateDto,
  ): Promise<Observable<User>> {
    return this.sendRCPRequest(UserUpdate.Topic, { id, updateUserDto });
  }

  async createOrganizer(
    createOrganizerDto: UserCreateOrganizerDto,
  ): Promise<Observable<User>> {
    return this.sendRCPRequest(UserCreateOrganizer.Topic, createOrganizerDto);
  }

  private async getAvatarLocation(email: string): Promise<string> {
    const avatarGoogleCloud = await firstValueFrom(
      this.sendRCPRequest(UserGetGCPFileTopic, email),
    );
    if (!avatarGoogleCloud) {
      throw new NotFoundException(ERROR_MESSAGES.FILE_EMAIL_NOT_FOUND);
    }
    return avatarGoogleCloud;
  }

  private async fileExists(bucket: Bucket, fileName: string): Promise<boolean> {
    const file = bucket.file(fileName);
    const [exists] = await file.exists();
    return exists;
  }

  private async getSignedUrl(bucket: Bucket, fileName: string) {
    const file = bucket.file(fileName);
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: EXPIRES,
    });
    return url;
  }

  private async deleteFile(bucket: Bucket, fileName: string) {
    const file = bucket.file(fileName);
    await file.delete();
  }

  // Only local storage use
  // async addAvatar(
  //   id: number,
  //   fileData: LocalFileData,
  // ): Promise<Observable<User>> {
  //   return this.sendRCPRequest(UserUploadFileTopic, { id, fileData });
  // }
}
