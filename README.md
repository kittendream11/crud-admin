# Admin CRUD System

A comprehensive, production-ready admin panel with user management, content management, and dashboard built with NestJS and Next.js 14.

## 🚀 Quick Start (All Issues Fixed!)

### Prerequisites
- **Node.js 18+** - Download from https://nodejs.org/
- **PostgreSQL 14+** - Download from https://postgresql.org/download/

### Start in 2 Terminal Windows

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:3001 in your browser!

**Test Account**: 
- Email: `admin@example.com`
- Password: `password123`

---

## Detailed Setup Guide

For complete setup instructions, environment configuration, database setup, troubleshooting, and more:

📖 **[Read SETUP_LOCALHOST.md](./SETUP_LOCALHOST.md)**

---

## Project Structure

```
├── backend/          # NestJS REST API (Port 3000)
├── frontend/         # Next.js 14 admin panel (Port 3001)
├── docs/            # Documentation
├── SETUP_LOCALHOST.md   # Setup instructions (NEW)
└── FIXES_APPLIED.md    # All fixes documentation (NEW)
```

## Quick Start (Docker Alternative)

```bash
docker-compose up -d
```

## Features


### Authentication
- JWT with refresh tokens
- Password reset/forgot password
- Session management
- Profile management

### User Management
- CRUD operations
- Role-based access control
- Pagination & filtering
- Search functionality
- Bulk operations
- CSV/Excel export

### Content Management
- Dynamic entity CRUD
- Image upload
- Rich text editor
- Draft/Published states
- Audit logs

### Dashboard
- Statistics cards
- Charts and analytics
- Recent activities feed
- Quick action buttons

### Security
- XSS protection
- CSRF tokens
- Rate limiting
- Input validation
- Role-based access control

### Infrastructure
- TypeORM with migrations
- Winston logging
- Health check endpoints
- Docker & Docker Compose
- Environment-based configuration

## API Documentation

Swagger documentation is available at `/api/docs` when the backend is running.

## Project Architecture

### Backend (NestJS)
- Modular architecture
- TypeORM with PostgreSQL
- Class-validator for validation
- JWT authentication
- Role-based access control (RBAC)
- Winston logging
- Swagger documentation
- Comprehensive error handling

### Frontend (Next.js 14)
- App Router
- Zustand for state management
- Axios with interceptors
- React Hook Form with Zod
- Tailwind CSS
- Shadcn/ui components
- Protected routes with middleware
- Dark/light mode support
- Internationalization ready

## Development

### Backend Commands
```bash
cd backend
npm run dev        # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run migration:create  # Create new migration
```

### Frontend Commands
```bash
cd frontend
npm run dev        # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run lint       # Run ESLint
```

## Environment Variables

See `.env.example` files in both backend and frontend directories.

## Testing

Both backend and frontend include unit tests with Jest and React Testing Library.

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

## Deployment

### Frontend (Vercel)
See [DEPLOYMENT_FRONTEND.md](docs/DEPLOYMENT_FRONTEND.md)

### Backend (AWS/Heroku)
See [DEPLOYMENT_BACKEND.md](docs/DEPLOYMENT_BACKEND.md)

## License

MIT

## Support

For issues and questions, please open an issue on the repository.
