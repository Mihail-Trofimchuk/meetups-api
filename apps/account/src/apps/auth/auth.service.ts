import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';

import { compare, genSalt, hash } from 'bcryptjs';

import { User } from '@prisma/client';
import { GooglePayload } from '@app/interfaces';
import {
  AccountConfirmResponse,
  AccountLogin,
  AccountRegister,
} from '@app/contracts';

import { UserRepository } from '../user/user.repository';
import { ERROR_MESSAGES } from './auth.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public getCookieWithJwtAccessToken(userId: number): Promise<string> {
    const payload = { userId };
    const token = this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
    return token;
  }

  public getCookieWithJwtRefreshToken(userId: number): Promise<string> {
    const payload = { userId };
    const token = this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}s`,
    });

    return token;
  }

  async updateAccessToken(userId: number) {
    return await this.getCookieWithJwtAccessToken(userId);
  }

  async getUserIfRefreshTokenMatches(userId: number, refreshToken: string) {
    const user = await this.userRepository.findUserById(userId);

    const isRefreshTokenMatching = await compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async logout(userId: number) {
    return await this.userRepository.clearCurrentHashedRefreshToken(userId);
  }
  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await hash(refreshToken, 10);

    const user = await this.userRepository.setCurrentRefreshToken(
      userId,
      currentHashedRefreshToken,
    );
    return user;
  }

  async login(dto: AccountLogin.Request): Promise<AccountLogin.Response> {
    const { email, password } = dto;
    const { id } = await this.validateUser(email, password);

    const access_token = await this.getCookieWithJwtAccessToken(id);
    const refresh_token = await this.getCookieWithJwtRefreshToken(id);

    const user = await this.setCurrentRefreshToken(refresh_token, id);

    return {
      access_token: access_token,
      refresh_token: refresh_token,
      user: user,
    };
  }

  async googleLogin(dto: GooglePayload): Promise<AccountLogin.Response> {
    if (!dto?.email) {
      throw new RpcException(new ConflictException(ERROR_MESSAGES.GOOGLE_AUTH));
    }

    const { email } = dto;
    let user: User | null = await this.userRepository.findUser(email);

    if (!user) {
      user = await this.userRepository.createGoogleAccount(dto);
    }

    const access_token = await this.getCookieWithJwtAccessToken(user.id);
    const refresh_token = await this.getCookieWithJwtRefreshToken(user.id);

    return {
      access_token: access_token,
      refresh_token: refresh_token,
      user: user,
    };
  }

  async findUser(dto: GooglePayload): Promise<User> {
    const user = await this.userRepository.findUserById(dto.id);
    return user;
  }

  async register(
    registerDto: AccountRegister.Request,
  ): Promise<AccountRegister.Response> {
    const oldUser = await this.userRepository.findUser(registerDto.email);

    if (oldUser) {
      throw new RpcException(
        new ConflictException(ERROR_MESSAGES.USER_ALREADY_EXISTS),
      );
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(registerDto.password, salt);
    const newUser = await this.userRepository.create(
      registerDto,
      hashedPassword,
    );

    return newUser;
  }

  async validateUser(email: string, password: string): Promise<{ id: number }> {
    const user = await this.userRepository.findUser(email);

    if (!user) {
      throw new RpcException(
        new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND),
      );
    }

    const isCorrectPassword = await compare(password, user.passwordHash);

    if (!isCorrectPassword) {
      throw new RpcException(
        new UnauthorizedException(ERROR_MESSAGES.WRONG_PASSWORD),
      );
    }

    return {
      id: user.id,
    };
  }

  async confirmEmail(email: string): Promise<AccountConfirmResponse> {
    const user = await this.userRepository.findUserByEmail(email);

    if (user.isEmailConfirmed) {
      throw new RpcException(
        new BadRequestException(ERROR_MESSAGES.ALRADY_CONFIRMED),
      );
    }

    return await this.userRepository.markEmailAsConfirmed(email);
  }
}
