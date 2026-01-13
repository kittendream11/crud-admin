import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Version,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/entities/user.entity';
import { UpdateUserDto } from '../../auth/dto/auth.dto';
import {
  PaginationQueryDto,
  UpdateUserRoleDto,
  BulkDeleteDto,
  BulkUpdateRoleDto,
} from '../dto/user-query.dto';

@ApiTags('Users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiOperation({ summary: 'Get all users with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
  })
  async getAllUsers(@Query() query: PaginationQueryDto) {
    return this.usersService.getAllUsers(query);
  }

  @Get('search')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiOperation({ summary: 'Search users' })
  @ApiResponse({
    status: 200,
    description: 'Search results',
  })
  async searchUsers(@Query('q') query: string) {
    return this.usersService.searchUsers(query);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User found',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
  })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({
    status: 204,
    description: 'User deleted successfully',
  })
  async deleteUser(@Param('id') id: string) {
    await this.usersService.deleteUser(id);
  }

  @Put(':id/role')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update user role' })
  @ApiResponse({
    status: 200,
    description: 'User role updated successfully',
  })
  async updateUserRole(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    return this.usersService.updateUserRole(id, updateUserRoleDto.role);
  }

  @Put(':id/deactivate')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Deactivate user' })
  @ApiResponse({
    status: 200,
    description: 'User deactivated successfully',
  })
  async deactivateUser(@Param('id') id: string) {
    return this.usersService.deactivateUser(id);
  }

  @Put(':id/activate')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Activate user' })
  @ApiResponse({
    status: 200,
    description: 'User activated successfully',
  })
  async activateUser(@Param('id') id: string) {
    return this.usersService.activateUser(id);
  }

  @Post('bulk-delete')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Bulk delete users' })
  @ApiResponse({
    status: 200,
    description: 'Users deleted',
  })
  async bulkDeleteUsers(@Body() bulkDeleteDto: BulkDeleteDto) {
    return this.usersService.bulkDeleteUsers(bulkDeleteDto.ids);
  }

  @Post('bulk-update-role')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Bulk update user roles' })
  @ApiResponse({
    status: 200,
    description: 'Users updated',
  })
  async bulkUpdateRole(@Body() bulkUpdateRoleDto: BulkUpdateRoleDto) {
    return this.usersService.bulkUpdateUserRole(
      bulkUpdateRoleDto.ids,
      bulkUpdateRoleDto.role,
    );
  }
}
