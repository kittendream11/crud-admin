import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere, In } from 'typeorm';
import { User, UserRole } from '../../auth/entities/user.entity';
import { UpdateUserDto } from '../../auth/dto/auth.dto';
import { PaginationQueryDto } from '../dto/user-query.dto';
import {
  NotFoundException,
  BadRequestException,
} from '@common/exceptions/api.exception';

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getAllUsers(query: PaginationQueryDto): Promise<PaginatedResponse<User>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<User> = {};

    if (query.search) {
      where.email = Like(`%${query.search}%`);
      // Can add more search fields
    }

    if (query.role) {
      where.role = query.role;
    }

    const [data, total] = await this.usersRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: {
        [query.sortBy || 'createdAt']: query.sortOrder || 'DESC',
      },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'role',
        'isActive',
        'lastLogin',
        'createdAt',
        'updatedAt',
      ],
    });

    return {
      data,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'role',
        'isActive',
        'lastLogin',
        'lastPasswordChange',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.getUserById(id);

    if (updateUserDto.firstName) {
      user.firstName = updateUserDto.firstName;
    }

    if (updateUserDto.lastName) {
      user.lastName = updateUserDto.lastName;
    }

    if (updateUserDto.role) {
      user.role = updateUserDto.role;
    }

    if (typeof updateUserDto.isActive === 'boolean') {
      user.isActive = updateUserDto.isActive;
    }

    const updatedUser = await this.usersRepository.save(user);

    return this.sanitizeUser(updatedUser);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.getUserById(id);

    await this.usersRepository.remove(user);
  }

  async updateUserRole(id: string, role: UserRole): Promise<User> {
    const user = await this.getUserById(id);

    user.role = role;
    const updatedUser = await this.usersRepository.save(user);

    return this.sanitizeUser(updatedUser);
  }

  async bulkDeleteUsers(ids: string[]): Promise<{ deleted: number }> {
    if (!ids || ids.length === 0) {
      throw new BadRequestException('No user IDs provided');
    }

    const result = await this.usersRepository.delete(ids);

    return { deleted: result.affected || 0 };
  }

  async bulkUpdateUserRole(ids: string[], role: UserRole): Promise<{ updated: number }> {
    if (!ids || ids.length === 0) {
      throw new BadRequestException('No user IDs provided');
    }

    const result = await this.usersRepository.update(
      { id: In(ids) },
      { role },
    );

    return { updated: result.affected || 0 };
  }

  async deactivateUser(id: string): Promise<User> {
    const user = await this.getUserById(id);

    user.isActive = false;
    const updatedUser = await this.usersRepository.save(user);

    return this.sanitizeUser(updatedUser);
  }

  async activateUser(id: string): Promise<User> {
    const user = await this.getUserById(id);

    user.isActive = true;
    const updatedUser = await this.usersRepository.save(user);

    return this.sanitizeUser(updatedUser);
  }

  async searchUsers(query: string): Promise<User[]> {
    return this.usersRepository.find({
      where: [
        { email: Like(`%${query}%`) },
        { firstName: Like(`%${query}%`) },
        { lastName: Like(`%${query}%`) },
      ],
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'role',
        'isActive',
        'createdAt',
      ],
      take: 10,
    });
  }

  private sanitizeUser(user: User): User {
    const { password, refreshTokens, ...sanitized } = user;
    return sanitized as User;
  }
}
