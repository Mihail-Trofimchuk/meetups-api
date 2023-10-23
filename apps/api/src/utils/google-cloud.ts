import { Bucket, Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { FILE_UPLOAD_MESSAGE } from '../constants/google.constants';

@Injectable()
export class GoogleCloudService {
  constructor(private readonly configService: ConfigService) {}

  getBucket(): Bucket {
    const projectId = this.configService.get('GOOGLE_PROJECT_ID');
    const keyFilename = this.configService.get('GOOGLE_KEY');

    const storage = new Storage({
      projectId,
      keyFilename,
    });

    return storage.bucket(this.configService.get('GOOGLE_BUCKET'));
  }

  upload(file: Express.Multer.File, res: Response) {
    try {
      const bucket = this.getBucket();
      const avatar = bucket.file(file.originalname);
      const stream = avatar.createWriteStream();

      stream.end(file.buffer);

      res.status(200).send({ message: FILE_UPLOAD_MESSAGE });
    } catch (error) {
      res.status(500).send(error);
    }
  }
}
