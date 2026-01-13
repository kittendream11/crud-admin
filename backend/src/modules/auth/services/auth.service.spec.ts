import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/modules/auth/services/auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/modules/auth/entities/user.entity';
import { RefreshToken } from '../src/modules/auth/entities/refresh-token.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException } from '../src/common/exceptions/api.exception';

describe('AuthService', () => {
  let service: AuthService;
  let usersRepository: any;
  let refreshTokenRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(RefreshToken),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test-token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key) => {
              const config: Record<string, any> = {
                JWT_SECRET: 'test-secret',
                JWT_EXPIRATION: '15m',
                JWT_REFRESH_SECRET: 'test-refresh-secret',
                JWT_REFRESH_EXPIRATION: '7d',
                BCRYPT_ROUNDS: 10,
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersRepository = module.get(getRepositoryToken(User));
    refreshTokenRepository = module.get(getRepositoryToken(RefreshToken));
  });

  describe('register', () => {
    it('should throw ConflictException if user already exists', async () => {
      const createUserDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
      };

      usersRepository.findOne.mockResolvedValueOnce({
        id: '123',
        email: 'test@example.com',
      });

      await expect(service.register(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
