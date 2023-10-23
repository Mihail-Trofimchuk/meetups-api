// Local storage
// import { Injectable } from '@nestjs/common';

// import { DbService } from '@app/db';
// import { LocalFileData } from '@app/interfaces';
// import { LocalFile } from '@prisma/client';

// @Injectable()
// export class FilesRepository {
//   constructor(private readonly dbService: DbService) {}

//   async findOne(fileId: number): Promise<LocalFile> {
//     return this.dbService.localFile.findFirst({ where: { id: fileId } });
//   }

//   async saveLocalFileData(fileData: LocalFileData): Promise<LocalFile> {
//     return this.dbService.localFile.create({
//       data: {
//         fileName: fileData.filename,
//         path: fileData.path,
//         mimeType: fileData.mimetype,
//       },
//     });
//   }
// }
