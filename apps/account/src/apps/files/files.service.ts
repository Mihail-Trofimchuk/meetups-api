// Local storage
// import { Injectable, NotFoundException } from '@nestjs/common';
// import { RpcException } from '@nestjs/microservices';

// import { LocalFileData } from '@app/interfaces';
// import { LocalFile } from '@prisma/client';

// import { FilesRepository } from './files.repository';
// import { FILE_NOT_FOUND_ERROR } from './files.constants';

// @Injectable()
// export class FilesService {
//   constructor(private readonly filesRepository: FilesRepository) {}

//   async saveLocalFileData(fileData: LocalFileData): Promise<LocalFile> {
//     return await this.filesRepository.saveLocalFileData(fileData);
//   }

//   async getFileById(fileId: number): Promise<LocalFile> {
//     const file = await this.filesRepository.findOne(fileId);
//     if (!file) {
//       throw new RpcException(new NotFoundException(FILE_NOT_FOUND_ERROR));
//     }
//     return file;
//   }
// }
