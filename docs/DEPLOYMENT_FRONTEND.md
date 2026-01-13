# Frontend Setup & Deployment Guide

## Local Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env.local
```

4. **Configure API endpoint**
Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

5. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:3001`

## Building for Production

```bash
npm run build
npm start
```

## Vercel Deployment

### Recommended: Using Vercel CLI

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel
```

### Using GitHub Integration

1. **Push to GitHub**
```bash
git push origin main
```

2. **Connect to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Configure environment variables

3. **Set Environment Variables in Vercel**
   - `NEXT_PUBLIC_API_URL` = `https://api.yourdomain.com/api`
   - `NEXT_PUBLIC_APP_NAME` = `Admin CRUD System`

4. **Deploy**
   - Vercel will automatically deploy on push to main

## Docker Deployment

### Build Docker Image
```bash
docker build -t crud-admin-frontend .
```

### Run Container
```bash
docker run -p 3001:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:3000/api \
  crud-admin-frontend
```

## AWS S3 + CloudFront Deployment

### Build Static Export
```bash
npm run build
```

### Deploy to S3

1. **Install AWS CLI**
```bash
pip install awscli
```

2. **Upload to S3**
```bash
aws s3 sync out/ s3://your-bucket-name --delete
```

3. **Invalidate CloudFront Cache**
```bash
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

## Performance Optimization

### Image Optimization
- Next.js automatically optimizes images
- Configure image domains in `next.config.js`

### Code Splitting
- Automatic route-based code splitting
- Dynamic imports for large components

### SEO
- Meta tags configured in layout.tsx
- Open Graph support ready

## Security

### Security Headers
Already configured in `next.config.js`:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

### HTTPS
- Always use HTTPS in production
- Vercel provides free SSL certificates

### Content Security Policy
Add to `next.config.js`:
```javascript
headers: async () => {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'"
        }
      ]
    }
  ]
}
```

## Environment Variables

### Required
- `NEXT_PUBLIC_API_URL` - Backend API URL

### Optional
- `NEXT_PUBLIC_APP_NAME` - Application name
- `NEXT_PUBLIC_ENABLE_ANALYTICS` - Enable analytics
- `NEXT_PUBLIC_ENABLE_MAINTENANCE_MODE` - Maintenance mode

## Testing

### Unit Tests
```bash
npm test
```

### Test Coverage
```bash
npm run test:cov
```

## Build Optimization

### Analyze Bundle
```bash
npm install @next/bundle-analyzer
```

Add to `next.config.js`:
```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({...})
```

Run:
```bash
ANALYZE=true npm run build
```

## Monitoring

### Vercel Analytics
- Automatic with Vercel deployment
- Monitor Core Web Vitals

### Error Tracking
- Integrate Sentry for error tracking
- Monitor API errors with axios interceptors

## Troubleshooting

### Build Failures
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### API Connection Issues
- Check `NEXT_PUBLIC_API_URL`
- Verify backend is running
- Check CORS settings in backend

### Performance Issues
```bash
npm run build --analyze
```

## Deployment Checklist

- [ ] Environment variables configured
- [ ] API URL correct
- [ ] Build succeeds locally
- [ ] Tests pass
- [ ] Security headers configured
- [ ] Performance tested
- [ ] SEO optimized
- [ ] Dark mode working
- [ ] Responsive design verified
- [ ] Error handling tested

## Support

For Vercel-specific issues:
- Documentation: https://vercel.com/docs
- Support: https://vercel.com/support
