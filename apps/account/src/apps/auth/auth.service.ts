import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, genSalt, hash } from 'bcryptjs';
import {
  USER_ALREADY_EXISTS,
  USER_NOT_FOUND_ERROR,
  WRONG_PASSWORD_ERROR,
} from './auth.constants';
import { AccountRegister } from '@app/contracts';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(id: string) {
    return { access_token: await this.jwtService.signAsync({ id }) };
  }

  async register(
    registerDto: AccountRegister.Request,
  ): Promise<AccountRegister.Response> {
    const oldUser = await this.userRepository.findUser(registerDto.email);

    if (oldUser) {
      throw new Error(USER_ALREADY_EXISTS);
    }

    const salt = await genSalt(10);

    const hashedPassword = await hash(registerDto.password, salt);

    const newUser = await this.userRepository.create(
      registerDto,
      hashedPassword,
    );

    return newUser;
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findUser(email);
    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }

    const isCorrectPassword = await compare(password, user.passwordHash);
    if (!isCorrectPassword) {
      throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
    }

    return { id: user.id, email: user.email, role: user.role };
  }
}
