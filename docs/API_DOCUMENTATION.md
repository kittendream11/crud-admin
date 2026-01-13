# API Documentation

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication

All protected endpoints require JWT token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Endpoints

### Authentication

#### Register User
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "password123",
  "role": "viewer" (optional)
}

Response: 201
{
  "user": {...},
  "accessToken": "token",
  "refreshToken": "refresh_token",
  "expiresIn": "15m"
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200
{
  "user": {...},
  "accessToken": "token",
  "refreshToken": "refresh_token",
  "expiresIn": "15m"
}
```

#### Refresh Token
```
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh_token"
}

Response: 200
{
  "user": {...},
  "accessToken": "new_token",
  "refreshToken": "new_refresh_token",
  "expiresIn": "15m"
}
```

#### Logout
```
POST /auth/logout
Authorization: Bearer <access_token>

Response: 200
{
  "message": "Logged out successfully"
}
```

#### Get Current User
```
GET /auth/me
Authorization: Bearer <access_token>

Response: 200
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "viewer",
  "isActive": true,
  "createdAt": "2024-01-12T10:00:00Z",
  "updatedAt": "2024-01-12T10:00:00Z"
}
```

### Users Management

#### Get All Users
```
GET /users?page=1&limit=10&search=&role=&sortBy=createdAt&sortOrder=DESC
Authorization: Bearer <access_token>
Roles: admin, moderator

Response: 200
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 10,
  "pages": 10
}
```

#### Get User by ID
```
GET /users/{id}
Authorization: Bearer <access_token>
Roles: admin, moderator

Response: 200
{
  "id": "uuid",
  "email": "user@example.com",
  ...
}
```

#### Update User
```
PUT /users/{id}
Authorization: Bearer <access_token>
Roles: admin, moderator

{
  "firstName": "Jane",
  "lastName": "Doe",
  "role": "moderator",
  "isActive": true
}

Response: 200
```

#### Delete User
```
DELETE /users/{id}
Authorization: Bearer <access_token>
Roles: admin

Response: 204
```

#### Update User Role
```
PUT /users/{id}/role
Authorization: Bearer <access_token>
Roles: admin

{
  "role": "admin"
}

Response: 200
```

#### Deactivate User
```
PUT /users/{id}/deactivate
Authorization: Bearer <access_token>
Roles: admin

Response: 200
```

#### Activate User
```
PUT /users/{id}/activate
Authorization: Bearer <access_token>
Roles: admin

Response: 200
```

#### Bulk Delete Users
```
POST /users/bulk-delete
Authorization: Bearer <access_token>
Roles: admin

{
  "ids": ["uuid1", "uuid2"]
}

Response: 200
{
  "deleted": 2
}
```

#### Search Users
```
GET /users/search?q=search_query
Authorization: Bearer <access_token>
Roles: admin, moderator

Response: 200
[...]
```

### Content Management

#### Create Article
```
POST /content/articles
Authorization: Bearer <access_token>
Roles: admin, moderator

{
  "title": "Article Title",
  "slug": "article-title",
  "content": "Article content...",
  "description": "...",
  "status": "draft",
  "tags": ["tag1", "tag2"]
}

Response: 201
```

#### Get Articles
```
GET /content/articles?page=1&limit=10&status=published
Authorization: Bearer <access_token>

Response: 200
{
  "data": [...],
  "total": 50,
  "page": 1,
  "limit": 10,
  "pages": 5
}
```

#### Get Article by ID
```
GET /content/articles/{id}
Authorization: Bearer <access_token>

Response: 200
```

#### Update Article
```
PUT /content/articles/{id}
Authorization: Bearer <access_token>
Roles: admin, moderator

{
  "title": "Updated Title",
  ...
}

Response: 200
```

#### Delete Article
```
DELETE /content/articles/{id}
Authorization: Bearer <access_token>
Roles: admin

Response: 204
```

#### Publish Article
```
PUT /content/articles/{id}/publish
Authorization: Bearer <access_token>
Roles: admin, moderator

Response: 200
```

#### Archive Article
```
PUT /content/articles/{id}/archive
Authorization: Bearer <access_token>
Roles: admin, moderator

Response: 200
```

#### Get Categories
```
GET /content/categories?page=1&limit=10
Authorization: Bearer <access_token>

Response: 200
```

#### Create Category
```
POST /content/categories
Authorization: Bearer <access_token>
Roles: admin

{
  "name": "Category Name",
  "slug": "category-slug",
  "description": "...",
  "order": 0
}

Response: 201
```

### Health Check

#### Get Health Status
```
GET /health

Response: 200
{
  "status": "ok",
  "timestamp": "2024-01-12T10:00:00Z"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Invalid input",
  "errorCode": "VALIDATION_ERROR",
  "timestamp": "2024-01-12T10:00:00Z"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "errorCode": "UNAUTHORIZED",
  "timestamp": "2024-01-12T10:00:00Z"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "You do not have permission",
  "errorCode": "FORBIDDEN",
  "timestamp": "2024-01-12T10:00:00Z"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "errorCode": "NOT_FOUND",
  "timestamp": "2024-01-12T10:00:00Z"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "Resource already exists",
  "errorCode": "CONFLICT",
  "timestamp": "2024-01-12T10:00:00Z"
}
```

## Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per window
- **Headers**:
  - `X-RateLimit-Limit`: 100
  - `X-RateLimit-Remaining`: 99
  - `X-RateLimit-Reset`: 1704000000

## Pagination

Query parameters for paginated endpoints:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `search`: Search query
- `sortBy`: Field to sort by
- `sortOrder`: ASC or DESC

## Response Format

All successful responses follow this format:
```json
{
  "data": {...} | [...],
  "message": "Success",
  "statusCode": 200
}
```

Paginated responses:
```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 10,
  "pages": 10
}
```

## Interactive Documentation

View the complete API documentation at:
```
http://localhost:3000/api/docs
```

This Swagger UI allows you to test all endpoints directly.
