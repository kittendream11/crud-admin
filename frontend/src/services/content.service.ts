import { apiClient } from './api';

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  description?: string;
  featuredImage?: string;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  authorId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  order: number;
  isActive: boolean;
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

export interface ContentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  status?: 'draft' | 'published' | 'archived';
  action?: string;
  entity?: string;
}

class ContentService {
  // Articles
  async getArticles(params?: ContentQueryParams): Promise<PaginatedResponse<Article>> {
    return apiClient.get('/v1/content/articles', { params });
  }

  async getArticleById(id: string): Promise<Article> {
    return apiClient.get(`/v1/content/articles/${id}`);
  }

  async createArticle(data: Partial<Article>): Promise<Article> {
    return apiClient.post('/v1/content/articles', data);
  }

  async updateArticle(id: string, data: Partial<Article>): Promise<Article> {
    return apiClient.put(`/v1/content/articles/${id}`, data);
  }

  async deleteArticle(id: string): Promise<void> {
    await apiClient.delete(`/v1/content/articles/${id}`);
  }

  async publishArticle(id: string): Promise<Article> {
    return apiClient.put(`/v1/content/articles/${id}/publish`, {});
  }

  async archiveArticle(id: string): Promise<Article> {
    return apiClient.put(`/v1/content/articles/${id}/archive`, {});
  }

  // Categories
  async getCategories(params?: ContentQueryParams): Promise<PaginatedResponse<Category>> {
    return apiClient.get('/v1/content/categories', { params });
  }

  async getCategoryById(id: string): Promise<Category> {
    return apiClient.get(`/v1/content/categories/${id}`);
  }

  async createCategory(data: Partial<Category>): Promise<Category> {
    return apiClient.post('/v1/content/categories', data);
  }

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    return apiClient.put(`/v1/content/categories/${id}`, data);
  }

  async deleteCategory(id: string): Promise<void> {
    await apiClient.delete(`/v1/content/categories/${id}`);
  }

  // Audit Logs
  async getAuditLogs(params?: ContentQueryParams): Promise<PaginatedResponse<any>> {
    return apiClient.get('/v1/users/audit-logs', { params });
  }
}

export const contentService = new ContentService();

export default contentService;
