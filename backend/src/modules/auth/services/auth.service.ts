import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { CreateUserDto, LoginDto } from '../dto/auth.dto';
import {
  BadRequestException,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@common/exceptions/api.exception';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await this.hashPassword(createUserDto.password);

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(user);

    const { accessToken, refreshToken } = await this.generateTokens(savedUser);

    return {
      user: this.sanitizeUser(savedUser),
      accessToken,
      refreshToken,
      expiresIn: this.configService.get('JWT_EXPIRATION'),
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.comparePasswords(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    user.lastLogin = new Date();
    await this.usersRepository.save(user);

    const { accessToken, refreshToken } = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
      expiresIn: this.configService.get('JWT_EXPIRATION'),
    };
  }

  async validateUser(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user || !user.isActive) {
      return null;
    }

    return user;
  }

  async refreshAccessToken(refreshToken: string) {
    const token = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken, isRevoked: false },
      relations: ['user'],
    });

    if (!token || token.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.validateUser(token.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.generateTokens(user);

    // Revoke old token
    token.isRevoked = true;
    await this.refreshTokenRepository.save(token);

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn: this.configService.get('JWT_EXPIRATION'),
    };
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      const token = await this.refreshTokenRepository.findOne({
        where: { token: refreshToken },
      });

      if (token) {
        token.isRevoked = true;
        await this.refreshTokenRepository.save(token);
      }
    }

    // Optionally revoke all tokens for the user
    // await this.refreshTokenRepository.update(
    //   { userId, isRevoked: false },
    //   { isRevoked: true }
    // );
  }

  async revokeAllTokens(userId: string) {
    await this.refreshTokenRepository.update(
      { userId, isRevoked: false },
      { isRevoked: true },
    );
  }

  private async generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRATION'),
    });

    const refreshTokenExpiry = new Date();
    const refreshExpiresIn = this.configService.get('JWT_REFRESH_EXPIRATION');
    const daysMatch = refreshExpiresIn.match(/(\d+)d/);
    if (daysMatch) {
      refreshTokenExpiry.setDate(
        refreshTokenExpiry.getDate() + parseInt(daysMatch[1]),
      );
    }

    const refreshTokenPayload = {
      sub: user.id,
      type: 'refresh',
    };

    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: refreshExpiresIn,
    });

    await this.refreshTokenRepository.save({
      user,
      token: refreshToken,
      expiresAt: refreshTokenExpiry,
    });

    return { accessToken, refreshToken };
  }

  private async hashPassword(password: string): Promise<string> {
    const rounds = this.configService.get('BCRYPT_ROUNDS') || 10;
    return bcrypt.hash(password, rounds);
  }

  private async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  private sanitizeUser(user: User): Partial<User> {
    const { password, refreshTokens, ...sanitized } = user;
    return sanitized;
  }
}
