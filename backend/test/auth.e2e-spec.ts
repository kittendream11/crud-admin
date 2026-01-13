import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { User } from '../entities/user.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtStrategy,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(RefreshToken),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    authService = moduleFixture.get<AuthService>(AuthService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user', async () => {
      const createUserDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
      };

      const mockUser = {
        id: '123',
        ...createUserDto,
        password: 'hashed_password',
        role: 'viewer',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(authService, 'register').mockResolvedValueOnce({
        user: mockUser,
        accessToken: 'token',
        refreshToken: 'refresh_token',
        expiresIn: '15m',
      } as any);

      const result = await authService.register(createUserDto);

      expect(result).toBeDefined();
      expect(result.user.email).toEqual(createUserDto.email);
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login user with valid credentials', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: '123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'viewer',
        isActive: true,
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(authService, 'login').mockResolvedValueOnce({
        user: mockUser,
        accessToken: 'token',
        refreshToken: 'refresh_token',
        expiresIn: '15m',
      } as any);

      const result = await authService.login(loginDto);

      expect(result).toBeDefined();
      expect(result.user.email).toEqual(loginDto.email);
    });
  });
});
