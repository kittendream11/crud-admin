import { Test, TestingModule } from '@nestjs/testing';
import { ContentService } from '../services/content.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Article } from '../entities/article.entity';
import { Category } from '../entities/category.entity';
import { AuditLog } from '../entities/audit-log.entity';
import { Repository } from 'typeorm';

describe('ContentService', () => {
  let service: ContentService;
  let articleRepository: Repository<Article>;
  let categoryRepository: Repository<Category>;
  let auditLogRepository: Repository<AuditLog>;

  const mockArticle = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Article',
    slug: 'test-article',
    content: 'This is test content',
    description: 'Test description',
    status: 'draft' as const,
    tags: ['test'],
    authorId: 'user-id',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCategory = {
    id: '123e4567-e89b-12d3-a456-426614174001',
    name: 'Technology',
    slug: 'technology',
    description: 'Tech related articles',
    order: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepositories = {
    article: {
      find: jest.fn(),
      findOne: jest.fn(),
      findAndCount: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    },
    category: {
      find: jest.fn(),
      findOne: jest.fn(),
      findAndCount: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    },
    auditLog: {
      find: jest.fn(),
      findAndCount: jest.fn(),
      save: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentService,
        {
          provide: getRepositoryToken(Article),
          useValue: mockRepositories.article,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: mockRepositories.category,
        },
        {
          provide: getRepositoryToken(AuditLog),
          useValue: mockRepositories.auditLog,
        },
      ],
    }).compile();

    service = module.get<ContentService>(ContentService);
    articleRepository = module.get<Repository<Article>>(getRepositoryToken(Article));
    categoryRepository = module.get<Repository<Category>>(getRepositoryToken(Category));
    auditLogRepository = module.get<Repository<AuditLog>>(getRepositoryToken(AuditLog));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Article Methods', () => {
    describe('createArticle', () => {
      it('should create a new article', async () => {
        const createDto = {
          title: 'New Article',
          slug: 'new-article',
          content: 'Content here',
          description: 'Description',
          authorId: 'user-id',
        };

        mockRepositories.article.save.mockResolvedValue({ id: '123', ...createDto });

        const result = await service.createArticle(createDto, 'user-id');

        expect(mockRepositories.article.save).toHaveBeenCalled();
        expect(result).toBeDefined();
      });
    });

    describe('getAllArticles', () => {
      it('should return paginated articles', async () => {
        const query = { page: 1, limit: 10, search: '', sortBy: 'createdAt', sortOrder: 'DESC' };
        const articles = [mockArticle];

        mockRepositories.article.findAndCount.mockResolvedValue([articles, 1]);

        const result = await service.getAllArticles(query);

        expect(result).toEqual({
          data: articles,
          total: 1,
          page: 1,
          limit: 10,
          pages: 1,
        });
      });

      it('should filter articles by status', async () => {
        const query = { page: 1, limit: 10, search: '', status: 'published', sortBy: 'createdAt', sortOrder: 'DESC' };
        const articles = [{ ...mockArticle, status: 'published' }];

        mockRepositories.article.findAndCount.mockResolvedValue([articles, 1]);

        const result = await service.getAllArticles(query);

        expect(result.data).toEqual(articles);
      });

      it('should search articles by title or content', async () => {
        const query = { page: 1, limit: 10, search: 'test', sortBy: 'createdAt', sortOrder: 'DESC' };
        const articles = [mockArticle];

        mockRepositories.article.findAndCount.mockResolvedValue([articles, 1]);

        const result = await service.getAllArticles(query);

        expect(result.data).toEqual(articles);
      });
    });

    describe('getArticleById', () => {
      it('should return an article by id', async () => {
        mockRepositories.article.findOne.mockResolvedValue(mockArticle);

        const result = await service.getArticleById(mockArticle.id);

        expect(result).toEqual(mockArticle);
      });

      it('should throw error if article not found', async () => {
        mockRepositories.article.findOne.mockResolvedValue(null);

        await expect(service.getArticleById('non-existent')).rejects.toThrow();
      });
    });

    describe('updateArticle', () => {
      it('should update article details', async () => {
        const updateDto = { title: 'Updated Title' };

        mockRepositories.article.findOne.mockResolvedValue(mockArticle);
        mockRepositories.article.save.mockResolvedValue({ ...mockArticle, ...updateDto });
        mockRepositories.auditLog.save.mockResolvedValue({});

        const result = await service.updateArticle(mockArticle.id, updateDto, 'user-id');

        expect(mockRepositories.article.save).toHaveBeenCalled();
        expect(mockRepositories.auditLog.save).toHaveBeenCalled();
      });
    });

    describe('publishArticle', () => {
      it('should set article status to published and set publishedAt', async () => {
        mockRepositories.article.findOne.mockResolvedValue(mockArticle);
        mockRepositories.article.save.mockResolvedValue({
          ...mockArticle,
          status: 'published',
          publishedAt: new Date(),
        });
        mockRepositories.auditLog.save.mockResolvedValue({});

        const result = await service.publishArticle(mockArticle.id, 'user-id');

        expect(mockRepositories.article.save).toHaveBeenCalled();
      });
    });

    describe('deleteArticle', () => {
      it('should delete an article', async () => {
        mockRepositories.article.findOne.mockResolvedValue(mockArticle);
        mockRepositories.article.delete.mockResolvedValue({ affected: 1 });
        mockRepositories.auditLog.save.mockResolvedValue({});

        await service.deleteArticle(mockArticle.id, 'user-id');

        expect(mockRepositories.article.delete).toHaveBeenCalled();
      });
    });
  });

  describe('Category Methods', () => {
    describe('createCategory', () => {
      it('should create a new category', async () => {
        const createDto = {
          name: 'New Category',
          slug: 'new-category',
          description: 'Category description',
        };

        mockRepositories.category.save.mockResolvedValue({ id: '123', ...createDto });

        const result = await service.createCategory(createDto);

        expect(mockRepositories.category.save).toHaveBeenCalled();
        expect(result).toBeDefined();
      });
    });

    describe('getAllCategories', () => {
      it('should return all categories', async () => {
        const query = { page: 1, limit: 10, search: '', sortBy: 'order', sortOrder: 'ASC' };
        const categories = [mockCategory];

        mockRepositories.category.findAndCount.mockResolvedValue([categories, 1]);

        const result = await service.getAllCategories(query);

        expect(result.data).toEqual(categories);
      });
    });

    describe('getCategoryById', () => {
      it('should return a category by id', async () => {
        mockRepositories.category.findOne.mockResolvedValue(mockCategory);

        const result = await service.getCategoryById(mockCategory.id);

        expect(result).toEqual(mockCategory);
      });
    });

    describe('updateCategory', () => {
      it('should update category details', async () => {
        const updateDto = { name: 'Updated Category' };

        mockRepositories.category.findOne.mockResolvedValue(mockCategory);
        mockRepositories.category.save.mockResolvedValue({ ...mockCategory, ...updateDto });

        const result = await service.updateCategory(mockCategory.id, updateDto);

        expect(mockRepositories.category.save).toHaveBeenCalled();
      });
    });

    describe('deleteCategory', () => {
      it('should delete a category', async () => {
        mockRepositories.category.findOne.mockResolvedValue(mockCategory);
        mockRepositories.category.delete.mockResolvedValue({ affected: 1 });

        await service.deleteCategory(mockCategory.id);

        expect(mockRepositories.category.delete).toHaveBeenCalled();
      });
    });
  });

  describe('AuditLog Methods', () => {
    describe('getAuditLogs', () => {
      it('should return paginated audit logs', async () => {
        const query = { page: 1, limit: 20 };
        const logs = [
          {
            id: '1',
            action: 'CREATE' as const,
            entity: 'Article',
            entityId: 'article-id',
            createdAt: new Date(),
          },
        ];

        mockRepositories.auditLog.findAndCount.mockResolvedValue([logs, 1]);

        const result = await service.getAuditLogs(query);

        expect(result.data).toEqual(logs);
      });

      it('should filter logs by action', async () => {
        const query = { page: 1, limit: 20, action: 'CREATE' };
        const logs = [];

        mockRepositories.auditLog.findAndCount.mockResolvedValue([logs, 0]);

        const result = await service.getAuditLogs(query);

        expect(result.total).toBe(0);
      });
    });
  });
});
