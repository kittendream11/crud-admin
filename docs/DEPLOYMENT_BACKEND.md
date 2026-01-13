# Backend Setup & Deployment Guide

## Local Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env
```

4. **Configure database**
Edit `.env` with your PostgreSQL connection details:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=admin
DB_PASSWORD=password123
DB_DATABASE=crud_admin_db
```

5. **Run database migrations**
```bash
npm run migration:run
```

6. **Start development server**
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`
Swagger documentation at `http://localhost:3000/api/docs`

## Docker Setup

### Using Docker Compose

```bash
cd .. && docker-compose up -d
```

This will:
- Start PostgreSQL database
- Build and start the backend service
- Build and start the frontend service

### Manual Docker Build

```bash
# Build image
docker build -t crud-admin-backend .

# Run container
docker run -p 3000:3000 \
  -e DB_HOST=postgres \
  -e DB_USERNAME=admin \
  -e DB_PASSWORD=password123 \
  -e DB_DATABASE=crud_admin_db \
  -e JWT_SECRET=your-secret-key \
  crud-admin-backend
```

## Production Deployment

### AWS EC2 Deployment

1. **Launch EC2 Instance**
   - AMI: Ubuntu 22.04 LTS
   - Instance Type: t3.medium
   - Security Group: Allow ports 80, 443, 3000

2. **Install Dependencies**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs postgresql-client

# Install PM2
sudo npm install -g pm2
```

3. **Clone Repository**
```bash
git clone <repository-url>
cd crud-admin/backend
```

4. **Setup Environment**
```bash
cp .env.example .env
# Edit .env with production values
```

5. **Install & Build**
```bash
npm install
npm run build
```

6. **Run with PM2**
```bash
pm2 start dist/main.js --name "crud-admin-api"
pm2 save
pm2 startup
```

### Heroku Deployment

1. **Install Heroku CLI**
```bash
curl https://cli.heroku.com/install.sh | sh
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create Heroku App**
```bash
heroku create crud-admin-api
```

4. **Add PostgreSQL Add-on**
```bash
heroku addons:create heroku-postgresql:standard-0 -a crud-admin-api
```

5. **Set Environment Variables**
```bash
heroku config:set JWT_SECRET=your-production-secret -a crud-admin-api
heroku config:set JWT_REFRESH_SECRET=your-refresh-secret -a crud-admin-api
```

6. **Deploy**
```bash
git push heroku main
```

## Testing

### Unit Tests
```bash
npm test
```

### E2E Tests
```bash
npm run test:e2e
```

### Coverage
```bash
npm run test:cov
```

## Database Migrations

### Create Migration
```bash
npm run migration:create src/database/migrations/DescribeMigration
```

### Generate Migration (from entities)
```bash
npm run migration:generate src/database/migrations/DescribeMigration
```

### Run Migrations
```bash
npm run migration:run
```

### Revert Migrations
```bash
npm run migration:revert
```

## Monitoring & Logging

### View Logs
```bash
pm2 logs crud-admin-api
```

### Monitor Performance
```bash
pm2 monit
```

### Check Application Health
```bash
curl http://localhost:3000/api/v1/health
```

## SSL/HTTPS

### Using Let's Encrypt

1. **Install Certbot**
```bash
sudo apt-get install certbot python3-certbot-nginx
```

2. **Generate Certificate**
```bash
sudo certbot certonly --standalone -d yourdomain.com
```

3. **Update Next.js Config** (Frontend)
```javascript
const nextConfig = {
  // ... existing config
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ];
  },
};
```

## Performance Optimization

1. **Enable Compression**
```bash
npm install compression
```

2. **Database Connection Pooling**
- Already configured in TypeORM

3. **Caching Strategy**
- Implement Redis for frequently accessed data

4. **Rate Limiting**
- Configured in app.module.ts

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check credentials in .env
- Ensure database exists

### Port Already in Use
```bash
lsof -i :3000
kill -9 <PID>
```

### Memory Issues
```bash
pm2 delete crud-admin-api
pm2 start dist/main.js --name "crud-admin-api" -i max
```

## Support

For issues, check the logs:
```bash
tail -f logs/application-*.log
```
