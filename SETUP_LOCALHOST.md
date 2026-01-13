# 🚀 CRUD Admin System - Local Setup & Run Guide

## Prerequisites Installation

### Step 1: Install Node.js and npm

1. Download Node.js LTS from: https://nodejs.org/
2. Run the installer and accept all defaults
3. Restart your terminal/PowerShell
4. Verify installation:
```bash
node --version  # Should show v18.x or higher
npm --version   # Should show 9.x or higher
```

### Step 2: Install PostgreSQL

1. Download PostgreSQL from: https://www.postgresql.org/download/
2. Run the installer and set:
   - Password: `password123` (or as configured in .env)
   - Port: `5432`
3. After installation, verify PostgreSQL is running

---

## Quick Start (After Prerequisites Installed)

### Option A: Using PowerShell (Windows)

```powershell
# Open two PowerShell windows

# Terminal 1: Start Backend
cd d:\VIBECODE\crud-admin\backend
npm install
npm run start:dev

# Wait for "Application is running on: http://localhost:3000" message
# Then open Terminal 2:

# Terminal 2: Start Frontend
cd d:\VIBECODE\crud-admin\frontend
npm install
npm run dev

# Wait for "ready - started server on 0.0.0.0:3001"
```

### Option B: Using Command Prompt (Windows)

```cmd
REM Terminal 1: Backend
cd d:\VIBECODE\crud-admin\backend
npm install
npm run start:dev

REM Open new Command Prompt window and run:

REM Terminal 2: Frontend
cd d:\VIBECODE\crud-admin\frontend
npm install
npm run dev
```

### Option C: Using Bash/WSL (Windows Subsystem for Linux)

```bash
# Terminal 1: Backend
cd /mnt/d/VIBECODE/crud-admin/backend
npm install
npm run start:dev

# Terminal 2: Frontend
cd /mnt/d/VIBECODE/crud-admin/frontend
npm install
npm run dev
```

---

## Access the Application

Once both services are running:

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api/docs

---

## First Time Setup (Database)

### 1. Create Database
```bash
# Connect to PostgreSQL and create the database
# Using psql (PostgreSQL command line):

createdb -U admin -h localhost crud_admin_db
```

Or using pgAdmin (GUI):
1. Open pgAdmin
2. Right-click "Databases" → Create → Database
3. Name: `crud_admin_db`
4. Owner: `admin`
5. Click Save

### 2. Run Migrations
```bash
cd d:\VIBECODE\crud-admin\backend
npm run migration:run
```

### 3. Test API
Open http://localhost:3000/api/docs in your browser to see Swagger documentation.

---

## Default Test Account

After migrations run, you can test with:
```
Email:    admin@example.com
Password: password123
```

Or register a new account using the frontend at http://localhost:3001/register

---

## Project Structure

```
crud-admin/
├── backend/              # NestJS API
│   ├── src/
│   │   ├── modules/     # Feature modules (auth, users, content)
│   │   ├── common/      # Shared services (logging, filters)
│   │   ├── config/      # Configuration files
│   │   └── main.ts      # Application entry point
│   ├── .env             # Backend configuration (CREATED)
│   └── package.json
│
├── frontend/            # Next.js 14 frontend
│   ├── src/
│   │   ├── app/        # Next.js pages and layouts
│   │   ├── components/ # React components
│   │   ├── services/   # API client services
│   │   └── store/      # Zustand state management
│   ├── .env.local      # Frontend configuration (CREATED)
│   └── package.json
│
├── docs/               # Documentation
│   ├── ARCHITECTURE.md
│   ├── DEPLOYMENT_BACKEND.md
│   ├── DEPLOYMENT_FRONTEND.md
│   └── API_DOCUMENTATION.md
│
├── start.sh           # Linux/Mac startup script
└── start.bat          # Windows startup script
```

---

## Troubleshooting

### Backend won't start - "Cannot find module"
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm run start:dev
```

### Frontend won't compile - TypeScript errors
```bash
cd frontend
rm -rf node_modules .next package-lock.json
npm install
npm run dev
```

### Cannot connect to database
1. Ensure PostgreSQL is running
2. Check database credentials in backend/.env match your PostgreSQL setup
3. Verify database `crud_admin_db` exists:
   ```bash
   createdb -U admin -h localhost crud_admin_db
   ```

### Port already in use
- **Port 3000 in use**: Change `APP_PORT` in backend/.env
- **Port 3001 in use**: Change port in frontend package.json dev script

### CORS errors in frontend console
Ensure `CORS_ORIGIN=http://localhost:3001` is set in backend/.env

---

## Common Commands

### Backend
```bash
cd backend

# Development mode with hot reload
npm run start:dev

# Production build
npm build

# Run tests
npm test

# Run E2E tests
npm run test:e2e

# View API docs
# Open http://localhost:3000/api/docs
```

### Frontend
```bash
cd frontend

# Development mode with hot reload
npm run dev

# Production build
npm run build

# Run tests
npm test

# Type checking
npm run type-check
```

### Database
```bash
cd backend

# Run pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Generate new migration
npm run migration:generate -- -n MigrationName
```

---

## Features Available

### ✅ Authentication
- Register new users
- Login with email/password
- JWT token with refresh token rotation
- Protected routes and role-based access

### ✅ User Management
- Create, read, update, delete users
- Assign roles (admin, moderator, viewer)
- Activate/deactivate users
- Pagination and search
- Bulk operations

### ✅ Content Management
- Create, edit, publish, archive articles
- Manage categories
- Audit logging for all changes
- Status workflows (draft → published → archived)

### ✅ Dashboard
- Real-time statistics
- User and article growth charts
- Role distribution pie chart
- Quick action buttons
- System health status

### ✅ UI Features
- Responsive design (mobile, tablet, desktop)
- Dark/light mode toggle
- Form validation (client & server)
- Toast notifications
- Error boundaries
- Loading skeletons

---

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/me` - Get current user

### Users
- `GET /api/v1/users` - List users (paginated)
- `GET /api/v1/users/:id` - Get user details
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user
- `PUT /api/v1/users/:id/role` - Change role
- `PUT /api/v1/users/:id/{activate|deactivate}` - Toggle active status

### Articles
- `GET /api/v1/content/articles` - List articles
- `GET /api/v1/content/articles/:id` - Get article
- `POST /api/v1/content/articles` - Create article
- `PUT /api/v1/content/articles/:id` - Update article
- `DELETE /api/v1/content/articles/:id` - Delete article
- `PUT /api/v1/content/articles/:id/publish` - Publish article
- `PUT /api/v1/content/articles/:id/archive` - Archive article

### Categories
- `GET /api/v1/content/categories` - List categories
- `GET /api/v1/content/categories/:id` - Get category
- `POST /api/v1/content/categories` - Create category
- `PUT /api/v1/content/categories/:id` - Update category
- `DELETE /api/v1/content/categories/:id` - Delete category

### Audit Logs
- `GET /api/v1/audit-logs` - View audit logs (admin only)

---

## Next Steps

1. ✅ Install Node.js and PostgreSQL (see Prerequisites)
2. ✅ Run backend with `npm run start:dev` (from backend folder)
3. ✅ Run frontend with `npm run dev` (from frontend folder)
4. ✅ Open http://localhost:3001 in your browser
5. ✅ Register or login with test account
6. ✅ Explore dashboard and features

---

## Documentation

For more detailed information, see:
- [Architecture Overview](../docs/ARCHITECTURE.md)
- [Backend Deployment](../docs/DEPLOYMENT_BACKEND.md)
- [Frontend Deployment](../docs/DEPLOYMENT_FRONTEND.md)
- [API Documentation](../docs/API_DOCUMENTATION.md)

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the API docs at http://localhost:3000/api/docs
3. Check application logs in terminal
4. Review error messages in browser console (F12)

---

**Happy Coding! 🎉**
