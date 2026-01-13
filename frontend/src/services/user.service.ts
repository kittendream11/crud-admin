import { apiClient } from './api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

class UserService {
  async getUsers(params?: UserQueryParams): Promise<PaginatedResponse<User>> {
    return apiClient.get('/v1/users', { params });
  }

  async getUserById(id: string): Promise<User> {
    return apiClient.get(`/v1/users/${id}`);
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return apiClient.put(`/v1/users/${id}`, data);
  }

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/v1/users/${id}`);
  }

  async updateUserRole(id: string, role: string): Promise<User> {
    return apiClient.put(`/v1/users/${id}/role`, { role });
  }

  async deactivateUser(id: string): Promise<User> {
    return apiClient.put(`/v1/users/${id}/deactivate`, {});
  }

  async activateUser(id: string): Promise<User> {
    return apiClient.put(`/v1/users/${id}/activate`, {});
  }

  async bulkDeleteUsers(ids: string[]): Promise<{ deleted: number }> {
    return apiClient.post('/v1/users/bulk-delete', { ids });
  }

  async bulkUpdateRole(ids: string[], role: string): Promise<{ updated: number }> {
    return apiClient.post('/v1/users/bulk-update-role', { ids, role });
  }

  async searchUsers(query: string): Promise<User[]> {
    return apiClient.get('/v1/users/search', { params: { q: query } });
  }
}

export const userService = new UserService();

export default userService;
