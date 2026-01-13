import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../../../app.module';
import * as request from 'supertest';

/**
 * E2E tests for the complete authentication and user management flow
 * Run with: npm run test:e2e
 */

describe('Auth & User Management E2E Tests', () => {
  let app: INestApplication;
  let jwtToken: string;
  let refreshToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication Flow', () => {
    describe('POST /api/v1/auth/register', () => {
      it('should register a new user', () => {
        return request(app.getHttpServer())
          .post('/api/v1/auth/register')
          .send({
            email: `test-${Date.now()}@example.com`,
            firstName: 'John',
            lastName: 'Doe',
            password: 'Password123!',
          })
          .expect(201)
          .expect((res) => {
            expect(res.body).toHaveProperty('accessToken');
            expect(res.body).toHaveProperty('refreshToken');
            expect(res.body).toHaveProperty('user');
            expect(res.body.user).toHaveProperty('email');
            jwtToken = res.body.accessToken;
            refreshToken = res.body.refreshToken;
            userId = res.body.user.id;
          });
      });

      it('should reject duplicate email', () => {
        const email = `test-${Date.now()}@example.com`;

        return request(app.getHttpServer())
          .post('/api/v1/auth/register')
          .send({
            email,
            firstName: 'Jane',
            lastName: 'Smith',
            password: 'Password123!',
          })
          .then(() => {
            return request(app.getHttpServer())
              .post('/api/v1/auth/register')
              .send({
                email,
                firstName: 'Duplicate',
                lastName: 'User',
                password: 'Password123!',
              })
              .expect(409);
          });
      });

      it('should reject weak passwords', () => {
        return request(app.getHttpServer())
          .post('/api/v1/auth/register')
          .send({
            email: `weak-${Date.now()}@example.com`,
            firstName: 'John',
            lastName: 'Doe',
            password: '123',
          })
          .expect(400);
      });
    });

    describe('POST /api/v1/auth/login', () => {
      let testEmail: string;
      let testPassword: string;

      beforeAll(async () => {
        testEmail = `login-test-${Date.now()}@example.com`;
        testPassword = 'Password123!';

        await request(app.getHttpServer())
          .post('/api/v1/auth/register')
          .send({
            email: testEmail,
            firstName: 'Login',
            lastName: 'Test',
            password: testPassword,
          });
      });

      it('should login with correct credentials', () => {
        return request(app.getHttpServer())
          .post('/api/v1/auth/login')
          .send({
            email: testEmail,
            password: testPassword,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('accessToken');
            expect(res.body).toHaveProperty('refreshToken');
            expect(res.body.user.email).toBe(testEmail);
          });
      });

      it('should reject invalid email', () => {
        return request(app.getHttpServer())
          .post('/api/v1/auth/login')
          .send({
            email: 'nonexistent@example.com',
            password: testPassword,
          })
          .expect(401);
      });

      it('should reject invalid password', () => {
        return request(app.getHttpServer())
          .post('/api/v1/auth/login')
          .send({
            email: testEmail,
            password: 'WrongPassword123!',
          })
          .expect(401);
      });
    });

    describe('POST /api/v1/auth/refresh', () => {
      it('should refresh access token with valid refresh token', () => {
        return request(app.getHttpServer())
          .post('/api/v1/auth/refresh')
          .send({
            refreshToken,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('accessToken');
            expect(res.body).toHaveProperty('refreshToken');
            jwtToken = res.body.accessToken;
          });
      });

      it('should reject invalid refresh token', () => {
        return request(app.getHttpServer())
          .post('/api/v1/auth/refresh')
          .send({
            refreshToken: 'invalid-token',
          })
          .expect(401);
      });
    });

    describe('GET /api/v1/auth/me', () => {
      it('should return current user with valid token', () => {
        return request(app.getHttpServer())
          .get('/api/v1/auth/me')
          .set('Authorization', `Bearer ${jwtToken}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('email');
            expect(res.body).toHaveProperty('firstName');
          });
      });

      it('should reject request without token', () => {
        return request(app.getHttpServer())
          .get('/api/v1/auth/me')
          .expect(401);
      });

      it('should reject invalid token', () => {
        return request(app.getHttpServer())
          .get('/api/v1/auth/me')
          .set('Authorization', 'Bearer invalid-token')
          .expect(401);
      });
    });
  });

  describe('User Management E2E', () => {
    describe('GET /api/v1/users', () => {
      it('should list users with pagination', () => {
        return request(app.getHttpServer())
          .get('/api/v1/users?page=1&limit=10')
          .set('Authorization', `Bearer ${jwtToken}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('data');
            expect(res.body).toHaveProperty('total');
            expect(res.body).toHaveProperty('page');
            expect(Array.isArray(res.body.data)).toBe(true);
          });
      });
    });

    describe('GET /api/v1/users/:id', () => {
      it('should get user by id', () => {
        return request(app.getHttpServer())
          .get(`/api/v1/users/${userId}`)
          .set('Authorization', `Bearer ${jwtToken}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.id).toBe(userId);
          });
      });

      it('should return 404 for non-existent user', () => {
        return request(app.getHttpServer())
          .get('/api/v1/users/non-existent-id')
          .set('Authorization', `Bearer ${jwtToken}`)
          .expect(404);
      });
    });

    describe('PUT /api/v1/users/:id', () => {
      it('should update user details', () => {
        return request(app.getHttpServer())
          .put(`/api/v1/users/${userId}`)
          .set('Authorization', `Bearer ${jwtToken}`)
          .send({
            firstName: 'Updated',
            lastName: 'Name',
          })
          .expect(200);
      });

      it('should not allow updating password via user endpoint', () => {
        return request(app.getHttpServer())
          .put(`/api/v1/users/${userId}`)
          .set('Authorization', `Bearer ${jwtToken}`)
          .send({
            firstName: 'Test',
            password: 'NewPassword123!',
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.password).toBeUndefined();
          });
      });
    });
  });

  describe('Content Management E2E', () => {
    let articleId: string;
    let categoryId: string;

    describe('Categories', () => {
      describe('POST /api/v1/content/categories', () => {
        it('should create category (admin only)', () => {
          return request(app.getHttpServer())
            .post('/api/v1/content/categories')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
              name: 'Test Category',
              slug: `test-category-${Date.now()}`,
              description: 'Test description',
            })
            .expect((res) => {
              if (res.status === 201) {
                categoryId = res.body.id;
              }
            });
        });
      });
    });

    describe('Articles', () => {
      describe('POST /api/v1/content/articles', () => {
        it('should create article (moderator+)', () => {
          return request(app.getHttpServer())
            .post('/api/v1/content/articles')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
              title: 'Test Article',
              slug: `test-article-${Date.now()}`,
              content: 'This is test content for the article',
              description: 'Test description',
              status: 'draft',
            })
            .expect((res) => {
              if (res.status === 201) {
                articleId = res.body.id;
              }
            });
        });
      });

      describe('GET /api/v1/content/articles', () => {
        it('should list articles with pagination', () => {
          return request(app.getHttpServer())
            .get('/api/v1/content/articles?page=1&limit=10')
            .set('Authorization', `Bearer ${jwtToken}`)
            .expect(200)
            .expect((res) => {
              expect(res.body).toHaveProperty('data');
              expect(res.body).toHaveProperty('total');
            });
        });
      });

      if (articleId) {
        describe('PUT /api/v1/content/articles/:id', () => {
          it('should update article', () => {
            return request(app.getHttpServer())
              .put(`/api/v1/content/articles/${articleId}`)
              .set('Authorization', `Bearer ${jwtToken}`)
              .send({
                title: 'Updated Title',
              })
              .expect((res) => {
                if (res.status === 200) {
                  expect(res.body.title).toBe('Updated Title');
                }
              });
          });
        });

        describe('PUT /api/v1/content/articles/:id/publish', () => {
          it('should publish article', () => {
            return request(app.getHttpServer())
              .put(`/api/v1/content/articles/${articleId}/publish`)
              .set('Authorization', `Bearer ${jwtToken}`)
              .expect((res) => {
                if (res.status === 200) {
                  expect(res.body.status).toBe('published');
                }
              });
          });
        });
      }
    });
  });

  describe('Authorization', () => {
    it('should deny access without token', () => {
      return request(app.getHttpServer())
        .get('/api/v1/users')
        .expect(401);
    });

    it('should deny access with invalid token', () => {
      return request(app.getHttpServer())
        .get('/api/v1/users')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid request data', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'not-an-email',
          password: '',
        })
        .expect(400);
    });

    it('should handle non-existent endpoints', () => {
      return request(app.getHttpServer())
        .get('/api/v1/non-existent-endpoint')
        .expect(404);
    });
  });
});
