# Vercel Deployment Instructions

## Prerequisites
- GitHub account with this repository
- Vercel account (https://vercel.com)

## Step-by-Step Deployment

### 1. Connect Repository to Vercel
1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Select "Import Git Repository"
4. Choose `crud-admin` repository
5. Click "Import"

### 2. Configure Project Settings
- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `frontend`
- **Node.js Version**: 20.x

### 3. Set Environment Variables
In Vercel Project Settings > Environment Variables, add:

```
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
```

Replace `https://your-backend-api.com` with your actual backend URL.

### 4. Deploy
Click "Deploy" button. Vercel will automatically:
- Install dependencies with `npm install --legacy-peer-deps`
- Run build command: `npm run build`
- Deploy the application

### 5. Configure Custom Domain (Optional)
- In Project Settings > Domains
- Add your custom domain
- Update DNS records as instructed by Vercel

## Environment Variables for Deployment

### Frontend (.env.production)
```
NEXT_PUBLIC_API_URL=https://your-api-endpoint.com/api
```

### Backend Deployment
For the backend, deploy to:
- **AWS EC2** - See docs/DEPLOYMENT_BACKEND.md
- **Heroku** - See docs/DEPLOYMENT_BACKEND.md
- **Railway.app** - Quick alternative to Heroku
- **Render.com** - Free tier available

## Database Configuration
- PostgreSQL must be configured and running
- Ensure backend environment variables point to correct DB

## Troubleshooting

### Build fails with SWC error
- Clear Vercel cache and redeploy
- Delete `node_modules` and `.next` locally, commit
- Push changes to trigger rebuild

### API connection errors
- Verify `NEXT_PUBLIC_API_URL` is correct
- Ensure backend API is accessible from Vercel
- Check CORS settings in backend

### Port issues
- Vercel automatically assigns PORT via `process.env.PORT`
- Frontend runs on assigned port (typically 3000 on Vercel)

## Production Checklist

- [ ] Backend API deployed and accessible
- [ ] Environment variables configured in Vercel
- [ ] Database migrations applied
- [ ] Build completes without errors
- [ ] Site loads without console errors
- [ ] Login functionality works
- [ ] API calls succeed

## Support
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- See docs/DEPLOYMENT_BACKEND.md for backend deployment
