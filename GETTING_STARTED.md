# Getting Started

This guide will help you set up and run the complete Admin CRUD System locally.

## Prerequisites

- **Node.js**: 18.x or higher
- **PostgreSQL**: 14.x or higher
- **npm** or **yarn**
- **Git**

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd crud-admin
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment
```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=crud_admin_db
JWT_SECRET=your-super-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
```

#### Create Database

```bash
# Using psql
createdb -U your_username crud_admin_db
```

Or using PostgreSQL GUI tools like pgAdmin.

#### Run Migrations

```bash
npm run migration:run
```

#### Start Backend Server

```bash
npm run start:dev
```

Backend will run at `http://localhost:3000`
Swagger docs at `http://localhost:3000/api/docs`

### 3. Frontend Setup

In a new terminal:

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Configure Environment
```bash
cp .env.example .env.local
```

No additional configuration needed if backend is running on localhost:3000

#### Start Frontend Server

```bash
npm run dev
```

Frontend will run at `http://localhost:3001`

## Docker Setup (Alternative)

### Using Docker Compose

```bash
# From root directory
docker-compose up -d
```

This will:
1. Start PostgreSQL container
2. Build and run backend
3. Build and run frontend

Access:
- Frontend: `http://localhost:3001`
- Backend: `http://localhost:3000`
- API Docs: `http://localhost:3000/api/docs`

## First Steps

### 1. Create Admin Account

Go to `http://localhost:3001/register`

Register with:
```
Email: admin@example.com
Password: password123
```

**Note**: First user should be created as Admin manually. After that, only admins can create other admins.

### 2. Login

Go to `http://localhost:3001/login`

Use the credentials from step 1.

### 3. Explore Features

- **Dashboard**: Overview and statistics
- **Users**: Create, edit, delete users
- **Content**: Manage articles and categories
- **Audit Logs**: View all changes

## Testing the API

### Using Swagger UI

Navigate to `http://localhost:3000/api/docs`

1. Click on any endpoint
2. Click "Try it out"
3. For protected endpoints, click the lock icon and enter your token:
   - Get token from login response
   - Or use "Authorize" button at top

### Using cURL

```bash
# Register
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get Users (replace TOKEN with actual token)
curl -X GET http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer TOKEN"
```

### Using Postman

1. Import the API collection from Swagger (`http://localhost:3000/api-json`)
2. Set base URL: `http://localhost:3000/api/v1`
3. Get auth token from login endpoint
4. Set `Authorization` header in collection to use token

## Troubleshooting

### PostgreSQL Connection Issues

**Error**: `connect ECONNREFUSED 127.0.0.1:5432`

Solution:
1. Check PostgreSQL is running: `sudo service postgresql status`
2. Check credentials in `.env`
3. Verify database exists: `psql -l`

### Port Already in Use

**Error**: `Address already in use :::3000`

Solution:
```bash
# Find process using port 3000
lsof -i :3000
# Kill process
kill -9 <PID>
```

### Build Errors

```bash
# Clear caches
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Migration Errors

```bash
# Check migration status
npm run migration:run -- --help

# Revert migrations
npm run migration:revert

# Drop and recreate
npm run migration:run -- --refresh
```

## Development Workflow

### Backend Development

1. Edit files in `backend/src/`
2. Dev server auto-reloads with `npm run start:dev`
3. Run tests: `npm test`
4. Format code: `npm run format`

### Frontend Development

1. Edit files in `frontend/src/`
2. Dev server auto-reloads with `npm run dev`
3. Run tests: `npm test`
4. Type check: `npm run type-check`

## Sample Data

### Test Users

Admin users can create test data through the API:

```bash
# Create a moderator
POST /api/v1/users
{
  "email": "moderator@example.com",
  "firstName": "Mod",
  "lastName": "User",
  "password": "password123",
  "role": "moderator"
}
```

## Next Steps

1. **Read Documentation**: Check `docs/` directory
   - [ARCHITECTURE.md](docs/ARCHITECTURE.md) - System architecture
   - [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) - API reference
   - [DEPLOYMENT_BACKEND.md](docs/DEPLOYMENT_BACKEND.md) - Backend deployment
   - [DEPLOYMENT_FRONTEND.md](docs/DEPLOYMENT_FRONTEND.md) - Frontend deployment

2. **Explore Code**: Both backend and frontend have well-documented code

3. **Customize**: Modify components, add features, integrate with your systems

4. **Deploy**: Follow deployment guides for production setup

## Support & Help

### Common Questions

**Q: Can I change the default port?**
A: Yes, set `APP_PORT` in backend `.env` and use `-p` flag for frontend

**Q: How do I add new modules?**
A: Create new feature modules in `backend/src/modules/` following the existing pattern

**Q: How do I customize the UI?**
A: Edit components in `frontend/src/components/` and styles in `globals.css` and `tailwind.config.ts`

### Getting Help

- Check error logs in terminal
- Review application logs in `backend/logs/`
- Check Swagger API documentation
- Review code comments and documentation

## Database Schema

The system includes tables for:
- `users` - User accounts
- `refresh_tokens` - Token management
- `articles` - Content
- `categories` - Content organization
- `audit_logs` - Change tracking

See migrations in `backend/src/database/migrations/` for details.

## Security Notes

1. **Change JWT Secrets**: Update `JWT_SECRET` and `JWT_REFRESH_SECRET` in `.env` for production
2. **Use Strong Passwords**: In production, enforce strong password requirements
3. **Enable HTTPS**: Always use HTTPS in production
4. **Environment Variables**: Never commit `.env` to version control
5. **Database Backups**: Regular backups are essential

## Performance Tips

1. **Database**: Index frequently queried columns
2. **API**: Enable caching for frequently accessed data
3. **Frontend**: Use React Query for optimized caching
4. **Images**: Optimize before upload

## What's Next?

Now that you have the system running:

1. **Explore the Dashboard**: Understand the UI
2. **Test the APIs**: Use Swagger to test endpoints
3. **Create Test Data**: Add sample users and content
4. **Review Code**: Understand architecture and patterns
5. **Customize**: Add your own features

## Useful Commands

### Backend
```bash
cd backend
npm run start:dev      # Development server
npm test              # Run tests
npm run build         # Production build
npm run lint          # Lint code
npm run format        # Format code
npm run migration:run # Run migrations
```

### Frontend
```bash
cd frontend
npm run dev           # Development server
npm run build         # Production build
npm test              # Run tests
npm run lint          # Lint code
npm run format        # Format code
```

## Success Checklist

- [ ] PostgreSQL installed and running
- [ ] Backend running at http://localhost:3000
- [ ] Frontend running at http://localhost:3001
- [ ] Able to register and login
- [ ] Can see users list
- [ ] Swagger documentation accessible
- [ ] Can create/edit/delete users
- [ ] Responsive design working

Once all boxes are checked, you're ready to start development!
