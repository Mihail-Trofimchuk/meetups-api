import { Injectable } from '@nestjs/common';

import { DbService } from '@app/db';
import { LocalFileData } from '@app/interfaces';

@Injectable()
export class FilesRepository {
  constructor(private readonly dbService: DbService) {}

  async findOne(fileId: number) {
    return this.dbService.localFile.findFirst({ where: { id: fileId } });
  }

  async saveLocalFileData(fileData: LocalFileData) {
    return this.dbService.localFile.create({
      data: {
        fileName: fileData.filename,
        path: fileData.path,
        mimeType: fileData.mimetype,
      },
    });
  }
}
