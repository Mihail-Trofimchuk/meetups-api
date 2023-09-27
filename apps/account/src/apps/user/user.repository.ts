import { AccountRegister } from '@app/contracts';
import { DbService } from '@app/db';
import { Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly dbService: DbService) {}

  async create(
    { displayName, email }: AccountRegister.Request,
    passwordHash: string,
  ) {
    return await this.dbService.user.create({
      data: {
        displayName: displayName,
        email: email,
        role: $Enums.Role.USER,
        passwordHash: passwordHash,
      },
    });
  }

  async findUser(email: string) {
    return await this.dbService.user.findFirst({ where: { email: email } });
  }

  async deleteUser(email: string) {
    return await this.dbService.user.delete({ where: { email: email } });
  }
}
