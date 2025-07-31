# Deployment Guide

## Quick Deploy Commands

### Initial Setup
```bash
# 1. Initialize git and push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/slpc-webapp.git
git push -u origin main

# 2. Deploy Sanity Studio
npx sanity deploy

# 3. Deploy to Vercel (via web interface)
# - Import from GitHub
# - Add environment variables
# - Deploy
```

### Regular Updates
```bash
# 1. Make changes locally
git add .
git commit -m "Description of changes"

# 2. Push to GitHub
git push origin main

# 3. Vercel auto-deploys (usually takes 1-2 minutes)
```

## Environment Variables for Vercel
```
NEXT_PUBLIC_SANITY_PROJECT_ID=h3prmcr9
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-12-01
```

## Branch Strategy
- `main` = Production (live website)
- `staging` = Testing environment  
- `development` = Active development

## Rollback Process
If something breaks:
1. Go to Vercel dashboard
2. Find previous working deployment
3. Click "Promote to Production"
