import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';

import { User } from '@prisma/client';
import { compare, genSalt, hash } from 'bcryptjs';

import { GooglePayload } from '@app/interfaces';
import { AccountLogin, AccountRegister } from '@app/contracts';

import { UserRepository } from '../user/user.repository';
import {
  GOOGLE_AUTH_ERROR,
  USER_ALREADY_EXISTS,
  USER_NOT_FOUND_ERROR,
  WRONG_PASSWORD_ERROR,
} from './auth.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: AccountLogin.Request) {
    const { email, password } = dto;
    const { id } = await this.validateUser(email, password);
    return {
      access_token: await this.jwtService.signAsync(
        { id },
        { expiresIn: '30s' },
      ),
    };
  }

  async googleLogin(dto: GooglePayload) {
    if (!dto?.email) {
      throw new RpcException(new ConflictException(GOOGLE_AUTH_ERROR));
    }
    const { email } = dto;

    let user: User | null = await this.userRepository.findUser(email);
    if (!user) {
      user = await this.userRepository.createGoogleAccount(dto);
    }

    const access_token = await this.jwtService.signAsync({ id: user.id });
    return {
      access_token: access_token,
    };
  }

  async findUser(dto: GooglePayload) {
    const user = await this.userRepository.findUserById(dto.id);
    return user;
  }

  async register(
    registerDto: AccountRegister.Request,
  ): Promise<AccountRegister.Response> {
    const oldUser = await this.userRepository.findUser(registerDto.email);

    if (oldUser) {
      throw new RpcException(new ConflictException(USER_ALREADY_EXISTS));
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
      throw new RpcException(new NotFoundException(USER_NOT_FOUND_ERROR));
    }

    const isCorrectPassword = await compare(password, user.passwordHash);
    if (!isCorrectPassword) {
      throw new RpcException(new UnauthorizedException(WRONG_PASSWORD_ERROR));
    }

    return { id: user.id, email: user.email, role: user.role };
  }
}
