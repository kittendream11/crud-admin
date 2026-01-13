import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../services/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'hashedpassword',
    role: 'viewer' as const,
    isActive: true,
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return paginated users', async () => {
      const query = { page: 1, limit: 10, search: '', role: undefined, sortBy: 'createdAt', sortOrder: 'DESC' };
      const users = [mockUser];

      mockUserRepository.findAndCount.mockResolvedValue([users, 1]);

      const result = await service.getAllUsers(query);

      expect(result).toEqual({
        data: users,
        total: 1,
        page: 1,
        limit: 10,
        pages: 1,
      });
      expect(mockUserRepository.findAndCount).toHaveBeenCalled();
    });

    it('should filter users by role', async () => {
      const query = { page: 1, limit: 10, search: '', role: 'admin', sortBy: 'createdAt', sortOrder: 'DESC' };
      const users = [{ ...mockUser, role: 'admin' }];

      mockUserRepository.findAndCount.mockResolvedValue([users, 1]);

      const result = await service.getAllUsers(query);

      expect(result.data).toEqual(users);
    });

    it('should search users by email or name', async () => {
      const query = { page: 1, limit: 10, search: 'john', role: undefined, sortBy: 'createdAt', sortOrder: 'DESC' };
      const users = [mockUser];

      mockUserRepository.findAndCount.mockResolvedValue([users, 1]);

      const result = await service.getAllUsers(query);

      expect(result.data).toEqual(users);
    });
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getUserById(mockUser.id);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
    });

    it('should return null if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.getUserById('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user details', async () => {
      const updateData = { firstName: 'Jane', lastName: 'Smith' };

      mockUserRepository.update.mockResolvedValue({ affected: 1 });
      mockUserRepository.findOne.mockResolvedValue({ ...mockUser, ...updateData });

      const result = await service.updateUser(mockUser.id, updateData);

      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser.id, updateData);
    });

    it('should not update password or email', async () => {
      const updateData = { firstName: 'Jane', password: 'newpassword' };
      const sanitized = { firstName: 'Jane' };

      mockUserRepository.update.mockResolvedValue({ affected: 1 });

      await service.updateUser(mockUser.id, updateData);

      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser.id, sanitized);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      mockUserRepository.delete.mockResolvedValue({ affected: 1 });

      await service.deleteUser(mockUser.id);

      expect(mockUserRepository.delete).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw error if user not found', async () => {
      mockUserRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.deleteUser('non-existent-id')).rejects.toThrow();
    });
  });

  describe('updateUserRole', () => {
    it('should update user role to admin', async () => {
      mockUserRepository.update.mockResolvedValue({ affected: 1 });

      await service.updateUserRole(mockUser.id, 'admin');

      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser.id, { role: 'admin' });
    });

    it('should update user role to moderator', async () => {
      mockUserRepository.update.mockResolvedValue({ affected: 1 });

      await service.updateUserRole(mockUser.id, 'moderator');

      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser.id, { role: 'moderator' });
    });
  });

  describe('deactivateUser', () => {
    it('should set isActive to false', async () => {
      mockUserRepository.update.mockResolvedValue({ affected: 1 });
      mockUserRepository.findOne.mockResolvedValue({ ...mockUser, isActive: false });

      await service.deactivateUser(mockUser.id);

      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser.id, { isActive: false });
    });
  });

  describe('activateUser', () => {
    it('should set isActive to true', async () => {
      mockUserRepository.update.mockResolvedValue({ affected: 1 });
      mockUserRepository.findOne.mockResolvedValue({ ...mockUser, isActive: true });

      await service.activateUser(mockUser.id);

      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser.id, { isActive: true });
    });
  });

  describe('bulkDeleteUsers', () => {
    it('should delete multiple users', async () => {
      const ids = ['id1', 'id2', 'id3'];

      mockUserRepository.delete.mockResolvedValue({ affected: 3 });

      await service.bulkDeleteUsers(ids);

      expect(mockUserRepository.delete).toHaveBeenCalled();
    });
  });

  describe('bulkUpdateUserRole', () => {
    it('should update role for multiple users', async () => {
      const ids = ['id1', 'id2'];

      mockUserRepository.update.mockResolvedValue({ affected: 2 });

      await service.bulkUpdateUserRole(ids, 'moderator');

      expect(mockUserRepository.update).toHaveBeenCalled();
    });
  });
});
