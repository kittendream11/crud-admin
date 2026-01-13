import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere, In } from 'typeorm';
import { Article } from '../entities/article.entity';
import { Category } from '../entities/category.entity';
import { AuditLog, AuditAction } from '../entities/audit-log.entity';
import { CreateArticleDto, UpdateArticleDto, ContentQueryDto } from '../dto/content.dto';
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@common/exceptions/api.exception';

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(AuditLog)
    private auditLogsRepository: Repository<AuditLog>,
  ) {}

  // ========== ARTICLES ==========

  async createArticle(
    createArticleDto: CreateArticleDto,
    userId: string,
  ): Promise<Article> {
    const existingArticle = await this.articlesRepository.findOne({
      where: { slug: createArticleDto.slug },
    });

    if (existingArticle) {
      throw new ConflictException('Article with this slug already exists');
    }

    const article = this.articlesRepository.create({
      ...createArticleDto,
      authorId: userId,
    });

    const savedArticle = await this.articlesRepository.save(article);

    // Log audit
    await this.createAuditLog(
      AuditAction.CREATE,
      'Article',
      savedArticle.id,
      userId,
      { title: savedArticle.title },
    );

    return savedArticle;
  }

  async getAllArticles(query: ContentQueryDto): Promise<PaginatedResponse<Article>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Article> = {};

    if (query.search) {
      where.title = Like(`%${query.search}%`);
    }

    if (query.status) {
      where.status = query.status;
    }

    const [data, total] = await this.articlesRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: {
        [query.sortBy || 'createdAt']: query.sortOrder || 'DESC',
      },
    });

    return {
      data,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async getArticleById(id: string): Promise<Article> {
    const article = await this.articlesRepository.findOne({
      where: { id },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return article;
  }

  async updateArticle(
    id: string,
    updateArticleDto: UpdateArticleDto,
    userId: string,
  ): Promise<Article> {
    const article = await this.getArticleById(id);
    const oldData = { ...article };

    Object.assign(article, updateArticleDto);
    const updatedArticle = await this.articlesRepository.save(article);

    // Log audit
    await this.createAuditLog(
      AuditAction.UPDATE,
      'Article',
      id,
      userId,
      { before: oldData, after: updateArticleDto },
    );

    return updatedArticle;
  }

  async deleteArticle(id: string, userId: string): Promise<void> {
    const article = await this.getArticleById(id);

    await this.articlesRepository.remove(article);

    // Log audit
    await this.createAuditLog(
      AuditAction.DELETE,
      'Article',
      id,
      userId,
      { title: article.title },
    );
  }

  async publishArticle(id: string, userId: string): Promise<Article> {
    const article = await this.getArticleById(id);

    article.status = 'published';
    article.publishedAt = new Date();

    const updatedArticle = await this.articlesRepository.save(article);

    await this.createAuditLog(
      AuditAction.UPDATE,
      'Article',
      id,
      userId,
      { action: 'published' },
    );

    return updatedArticle;
  }

  async archiveArticle(id: string, userId: string): Promise<Article> {
    const article = await this.getArticleById(id);

    article.status = 'archived';
    const updatedArticle = await this.articlesRepository.save(article);

    await this.createAuditLog(
      AuditAction.UPDATE,
      'Article',
      id,
      userId,
      { action: 'archived' },
    );

    return updatedArticle;
  }

  // ========== CATEGORIES ==========

  async createCategory(createCategoryDto: any): Promise<Category> {
    const existingCategory = await this.categoriesRepository.findOne({
      where: { slug: createCategoryDto.slug },
    });

    if (existingCategory) {
      throw new ConflictException('Category with this slug already exists');
    }

    const category = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async getAllCategories(query: ContentQueryDto): Promise<PaginatedResponse<Category>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Category> = { isActive: true };

    if (query.search) {
      where.name = Like(`%${query.search}%`);
    }

    const [data, total] = await this.categoriesRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: {
        order: 'ASC',
        [query.sortBy || 'createdAt']: query.sortOrder || 'DESC',
      },
    });

    return {
      data,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async getCategoryById(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async updateCategory(id: string, updateCategoryDto: any): Promise<Category> {
    const category = await this.getCategoryById(id);

    Object.assign(category, updateCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await this.getCategoryById(id);

    await this.categoriesRepository.remove(category);
  }

  // ========== AUDIT LOGS ==========

  async getAuditLogs(query: ContentQueryDto): Promise<PaginatedResponse<AuditLog>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<AuditLog> = {};

    if (query.search) {
      where.entity = Like(`%${query.search}%`);
    }

    const [data, total] = await this.auditLogsRepository.findAndCount({
      where,
      skip,
      take: limit,
      relations: ['user'],
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      data,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  private async createAuditLog(
    action: AuditAction,
    entity: string,
    entityId: string,
    userId: string,
    changes?: Record<string, any>,
  ): Promise<void> {
    const auditLog = this.auditLogsRepository.create({
      action,
      entity,
      entityId,
      userId,
      changes,
    });

    await this.auditLogsRepository.save(auditLog);
  }
}
