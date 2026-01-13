# Project Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 14)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Pages & Components (React)                          │   │
│  │  - Authentication (Login/Register)                   │   │
│  │  - Dashboard                                         │   │
│  │  - User Management                                   │   │
│  │  - Content Management                                │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  State Management (Zustand)                          │   │
│  │  - Auth Store                                        │   │
│  │  - Theme Store                                       │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Data Fetching (React Query + Axios)                │   │
│  │  - API Client with interceptors                      │   │
│  │  - Auth, User, Content Services                      │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    HTTP (REST API)
                           │
┌──────────────────────────┴──────────────────────────────────┐
│                 Backend (NestJS + TypeORM)                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Controllers & Routes                                │   │
│  │  - Auth Controller                                   │   │
│  │  - Users Controller                                  │   │
│  │  - Content Controller                                │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Services & Business Logic                           │   │
│  │  - Auth Service (JWT, Refresh tokens)               │   │
│  │  - Users Service (CRUD, Filtering)                  │   │
│  │  - Content Service (Articles, Categories)            │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Guards & Middleware                                 │   │
│  │  - JWT Auth Guard                                    │   │
│  │  - Roles Guard (RBAC)                                │   │
│  │  - Logger Middleware                                 │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Exception Handling & Validation                     │   │
│  │  - Custom Exception Filters                          │   │
│  │  - Class Validator                                   │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Entities & Repository Pattern                       │   │
│  │  - User, RefreshToken                                │   │
│  │  - Article, Category                                 │   │
│  │  - AuditLog                                          │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    SQL (TypeORM)
                           │
┌──────────────────────────┴──────────────────────────────────┐
│               PostgreSQL Database                            │
│  - users table                                              │
│  - refresh_tokens table                                     │
│  - articles table                                           │
│  - categories table                                         │
│  - audit_logs table                                         │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

### Backend
```
backend/
├── src/
│   ├── app.module.ts              # Main module
│   ├── main.ts                    # Application entry point
│   ├── config/                    # Configuration files
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── validation.ts
│   ├── common/                    # Shared utilities
│   │   ├── exceptions/            # Custom exceptions
│   │   ├── filters/               # Exception filters
│   │   ├── middleware/            # Custom middleware
│   │   ├── services/              # Shared services
│   │   └── logging/               # Winston logger
│   ├── modules/                   # Feature modules
│   │   ├── auth/                  # Authentication module
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── strategies/
│   │   │   ├── guards/
│   │   │   ├── entities/
│   │   │   ├── dto/
│   │   │   └── auth.module.ts
│   │   ├── users/                 # User management module
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── dto/
│   │   │   └── users.module.ts
│   │   ├── content/               # Content management module
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── entities/
│   │   │   ├── dto/
│   │   │   └── content.module.ts
│   │   └── health/                # Health check module
│   └── database/
│       ├── migrations/            # Database migrations
│       └── seeds/                 # Seed data
├── test/                          # Test files
├── package.json
├── tsconfig.json
├── Dockerfile
└── .env.example
```

### Frontend
```
frontend/
├── src/
│   ├── app/                       # Next.js app directory
│   │   ├── layout.tsx             # Root layout
│   │   ├── globals.css
│   │   ├── (auth)/                # Auth route group
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   └── (dashboard)/           # Dashboard route group
│   │       ├── dashboard/page.tsx
│   │       ├── admin/
│   │       │   ├── users/page.tsx
│   │       │   └── content/
│   │       └── layout.tsx
│   ├── components/                # React components
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Button.tsx
│   │   ├── Table.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── AuthInitializer.tsx
│   ├── services/                  # API services
│   │   ├── api.ts                 # Axios client
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   └── content.service.ts
│   ├── store/                     # Zustand stores
│   │   ├── auth.store.ts
│   │   └── theme.store.ts
│   ├── hooks/                     # Custom hooks
│   ├── types/                     # TypeScript types
│   └── lib/                       # Utilities
├── public/                        # Static files
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── Dockerfile
└── .env.example
```

## Data Flow

### Authentication Flow
1. User enters credentials on login page
2. Frontend calls `authService.login()`
3. API returns JWT tokens and user data
4. Tokens stored in localStorage
5. Axios interceptor adds token to requests
6. On token expiration, automatic refresh
7. User data stored in Zustand auth store

### User Management Flow
1. Admin navigates to Users page
2. React Query fetches users with pagination
3. Data displayed in table component
4. Admin can:
   - Search/filter users
   - Edit user details
   - Delete users
   - Assign roles
5. Changes persist to database

### Content Management Flow
1. User creates/edits article
2. Form validation with React Hook Form + Zod
3. Content service sends to backend
4. Backend validates with class-validator
5. Article saved to database
6. Audit log created
7. Success toast notification

## Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL + TypeORM
- **Authentication**: JWT + Passport
- **Validation**: class-validator + Joi
- **API Docs**: Swagger/OpenAPI
- **Logging**: Winston
- **Testing**: Jest
- **Security**: bcryptjs, helmet

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query + Axios
- **Forms**: React Hook Form + Zod
- **UI**: Custom components
- **Dark Mode**: next-themes
- **Notifications**: react-hot-toast
- **Charts**: Recharts

## Design Patterns

### Backend
- **Module Pattern**: Feature modules (auth, users, content)
- **Service Layer**: Business logic separated
- **Repository Pattern**: Data access abstraction
- **Guard Pattern**: Route protection (JWT, Roles)
- **Middleware Pattern**: Request logging, error handling
- **Strategy Pattern**: JWT + Refresh token strategies

### Frontend
- **Container/Presentational**: Components separation
- **Custom Hooks**: Logic reuse
- **Store Pattern**: State management with Zustand
- **Service Layer**: API abstraction
- **Protected Routes**: Access control

## Security Considerations

1. **Authentication**
   - JWT tokens with expiration
   - Refresh token rotation
   - Secure token storage

2. **Authorization**
   - Role-based access control (RBAC)
   - Route guards
   - Permission checks

3. **Data Protection**
   - Password hashing with bcryptjs
   - HTTPS enforcement
   - CORS configuration

4. **Input Validation**
   - Server-side validation (class-validator)
   - Client-side validation (Zod)
   - SQL injection prevention via ORM

5. **Error Handling**
   - Custom exception filters
   - No sensitive info in responses
   - Proper HTTP status codes

## Performance Optimization

1. **Database**
   - Indexed queries
   - Pagination
   - Connection pooling

2. **API**
   - Response compression
   - Rate limiting
   - Caching strategies

3. **Frontend**
   - Code splitting
   - Image optimization
   - Lazy loading
   - React Query caching

4. **Deployment**
   - Docker containerization
   - CDN for static assets
   - Database backups

## Scalability

1. **Horizontal Scaling**
   - Stateless API design
   - Docker containerization
   - Load balancing ready

2. **Vertical Scaling**
   - Database optimization
   - Caching strategies
   - Connection pooling

3. **Monitoring**
   - Application logging
   - Health checks
   - Performance metrics

## Testing Strategy

1. **Unit Tests**
   - Services, guards, utilities
   - Jest framework

2. **Integration Tests**
   - API endpoints
   - Database operations

3. **E2E Tests**
   - Complete user flows
   - Critical paths

4. **Coverage Target**: 80%+
