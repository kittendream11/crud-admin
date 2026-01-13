# Admin CRUD Backend API

A production-ready NestJS REST API for admin panel operations with comprehensive authentication, user management, and content management features.

## Features

### ✅ Authentication
- User registration and login
- JWT tokens with refresh token rotation
- Password hashing with bcryptjs
- Session management
- Protected routes and endpoints

### ✅ User Management
- CRUD operations for users
- Role-based access control (Admin, Moderator, Viewer)
- User search and filtering
- Pagination support
- Bulk operations (delete, update role)
- User activation/deactivation

### ✅ Content Management
- Article CRUD with draft/published/archived states
- Category management
- Rich text support
- Audit logging for all changes
- Image upload ready

### ✅ API Features
- RESTful endpoints with versioning
- Comprehensive Swagger/OpenAPI documentation
- Input validation with class-validator
- Global exception handling
- Request logging with Winston
- Rate limiting
- CORS support
- Health check endpoints

### ✅ Database
- PostgreSQL with TypeORM
- Database migrations
- Relationship management
- Audit trail logging

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your database credentials
# Then run migrations
npm run migration:run

# Start development server
npm run start:dev
```

The API will be available at `http://localhost:3000`
Swagger docs at `http://localhost:3000/api/docs`

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/me` - Get current user

### Users Management (Admin/Moderator)
- `GET /api/v1/users` - Get all users with pagination
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user
- `PUT /api/v1/users/:id/role` - Update user role
- `POST /api/v1/users/bulk-delete` - Bulk delete users
- `POST /api/v1/users/bulk-update-role` - Bulk update roles
- `GET /api/v1/users/search` - Search users

### Content Management (Admin/Moderator)
- `POST /api/v1/content/articles` - Create article
- `GET /api/v1/content/articles` - Get all articles
- `GET /api/v1/content/articles/:id` - Get article by ID
- `PUT /api/v1/content/articles/:id` - Update article
- `DELETE /api/v1/content/articles/:id` - Delete article
- `PUT /api/v1/content/articles/:id/publish` - Publish article
- `PUT /api/v1/content/articles/:id/archive` - Archive article
- `GET /api/v1/content/categories` - Get categories
- `POST /api/v1/content/categories` - Create category
- `GET /api/v1/content/audit-logs` - Get audit logs (Admin only)

### Health
- `GET /api/v1/health` - Health check

## Project Structure

```
src/
├── main.ts                 # Application entry point
├── app.module.ts          # Root module
├── config/                # Configuration
├── common/                # Shared utilities
│   ├── exceptions/        # Custom exceptions
│   ├── filters/           # Exception filters
│   ├── middleware/        # Custom middleware
│   ├── logging/           # Winston logger
│   └── services/          # Shared services
├── modules/               # Feature modules
│   ├── auth/             # Authentication
│   ├── users/            # User management
│   ├── content/          # Content management
│   └── health/           # Health check
└── database/             # Migrations & seeds
```

## Development

### Running Tests
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Database Migrations
```bash
# Create migration
npm run migration:create src/database/migrations/DescribeMigration

# Generate migration from entities
npm run migration:generate src/database/migrations/DescribeMigration

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

### Code Quality
```bash
# Lint code
npm run lint

# Format code
npm run format
```

## Environment Variables

See `.env.example` for all available options:

```env
NODE_ENV=development
APP_NAME=crud-admin-api
APP_PORT=3000
APP_URL=http://localhost:3000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=admin
DB_PASSWORD=password123
DB_DATABASE=crud_admin_db

JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=15m
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRATION=7d

BCRYPT_ROUNDS=10
CORS_ORIGIN=http://localhost:3001
```

## Docker

### Build and Run
```bash
docker build -t crud-admin-backend .
docker run -p 3000:3000 -e DB_HOST=host.docker.internal crud-admin-backend
```

### Using Docker Compose
```bash
docker-compose up -d
```

## Deployment

### Vercel/Heroku
See [DEPLOYMENT_BACKEND.md](../docs/DEPLOYMENT_BACKEND.md)

### AWS EC2
See [DEPLOYMENT_BACKEND.md](../docs/DEPLOYMENT_BACKEND.md)

## API Documentation

Complete API documentation with Swagger UI is available at:
```
http://localhost:3000/api/docs
```

You can test all endpoints directly from the Swagger UI.

See [API_DOCUMENTATION.md](../docs/API_DOCUMENTATION.md) for detailed endpoint information.

## Security

- ✅ JWT authentication with refresh tokens
- ✅ Password hashing with bcryptjs (10 rounds)
- ✅ Role-based access control (RBAC)
- ✅ Input validation on all endpoints
- ✅ Global exception handling
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Security headers

## Performance

- ✅ Database connection pooling
- ✅ Response compression
- ✅ Request logging
- ✅ Indexed queries
- ✅ Pagination support
- ✅ Efficient caching strategies

## Monitoring & Logging

Application uses Winston for comprehensive logging:
- Console output in development
- File-based rotation in production
- Log levels: debug, info, warn, error
- Structured JSON logging

Access logs at: `./logs/`

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
sudo service postgresql status

# Test connection
psql -U admin -d crud_admin_db -h localhost
```

### Port Already in Use
```bash
lsof -i :3000
kill -9 <PID>
```

### Migration Errors
```bash
# Revert all migrations
npm run migration:revert

# Check migration status
npm run migration:run -- --refresh
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT

## Support

For issues and questions, please check:
- API Documentation: `http://localhost:3000/api/docs`
- Application Logs: `./logs/`
- Issue Tracker: GitHub Issues

## Architecture

See [ARCHITECTURE.md](../docs/ARCHITECTURE.md) for detailed architecture information.

## Testing Credentials

For testing purposes:
```
Email: test@example.com
Password: password123
Role: viewer
```

Create additional users through the registration endpoint or UI.
