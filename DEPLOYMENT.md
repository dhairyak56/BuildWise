# BuildWise Deployment Guide

This guide will walk you through deploying BuildWise to Vercel with Supabase integration.

## Prerequisites

- [x] Supabase project set up
- [x] All database tables created (run `supabase_schema.sql`)
- [x] Environment variables configured locally
- [ ] GitHub repository (recommended)
- [ ] Vercel account

## Deployment Steps

### 1. Push to GitHub (Recommended)

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - BuildWise MVP"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/buildwise.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings
5. Add environment variables (see below)
6. Click "Deploy"

#### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? buildwise (or your choice)
# - Directory? ./
# - Override settings? No

# For production deployment:
vercel --prod
```

### 3. Configure Environment Variables

In your Vercel project settings, add these environment variables:

#### Required Variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
PERPLEXITY_API_KEY=your_perplexity_api_key
```

#### Optional (for email functionality):

```bash
RESEND_API_KEY=your_resend_api_key
```

**How to add in Vercel:**
1. Go to your project dashboard
2. Click "Settings" → "Environment Variables"
3. Add each variable with its value
4. Select "Production", "Preview", and "Development" environments
5. Click "Save"

### 4. Verify Deployment

After deployment completes:

1. **Check Build Logs**: Ensure no errors in the deployment logs
2. **Test Authentication**: Try signing up/logging in
3. **Test Database**: Create a project, verify it saves
4. **Test AI Features**: Generate a contract
5. **Test File Upload**: Upload a document
6. **Test Payments**: Add a payment to a project

### 5. Post-Deployment Configuration

#### Update Supabase Redirect URLs

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your Vercel deployment URL to:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: 
     - `https://your-app.vercel.app/auth/callback`
     - `https://your-app.vercel.app/login`
     - `https://your-app.vercel.app/dashboard`

#### Configure Custom Domain (Optional)

1. In Vercel: Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update Supabase redirect URLs with custom domain

## Troubleshooting

### Build Fails

**Issue**: Build fails with module errors
**Solution**: 
```bash
# Clear cache and rebuild locally first
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variables Not Working

**Issue**: App can't connect to Supabase
**Solution**:
- Verify all environment variables are set in Vercel
- Ensure `NEXT_PUBLIC_` prefix for client-side variables
- Redeploy after adding variables

### Authentication Redirect Issues

**Issue**: After login, redirects to wrong URL
**Solution**:
- Update Supabase redirect URLs to match your deployment URL
- Check middleware.ts proxy configuration

### API Routes Failing

**Issue**: `/api/*` routes return 500 errors
**Solution**:
- Check Vercel function logs
- Verify API keys are set correctly
- Ensure Perplexity API key is valid

## Performance Optimization

### Enable Edge Functions (Optional)

For better performance, consider deploying API routes as Edge Functions:

```typescript
// Add to API route files
export const runtime = 'edge'
```

### Configure Caching

Vercel automatically caches static assets. For dynamic content:

```typescript
// In route handlers
export const revalidate = 60 // Revalidate every 60 seconds
```

## Monitoring

### Vercel Analytics

Enable Vercel Analytics for insights:
1. Go to project Settings → Analytics
2. Enable Web Analytics
3. View real-time metrics in dashboard

### Error Tracking

Consider integrating Sentry for error tracking:

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

## Security Checklist

- [ ] All environment variables are set in Vercel (not in code)
- [ ] `.env.local` is in `.gitignore`
- [ ] Supabase RLS policies are enabled
- [ ] API keys are valid and not exposed
- [ ] Redirect URLs are configured in Supabase
- [ ] HTTPS is enabled (automatic with Vercel)

## Continuous Deployment

Once connected to GitHub, Vercel will automatically:
- Deploy on every push to `main` branch
- Create preview deployments for pull requests
- Run build checks before deployment

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review Supabase logs
3. Verify environment variables
4. Test locally with production build: `npm run build && npm start`

## Next Steps

After successful deployment:
1. Set up custom domain
2. Configure email service (Resend) for production
3. Set up monitoring and analytics
4. Create backup strategy for Supabase data
5. Plan for scaling (upgrade Vercel/Supabase plans as needed)

---

**Deployment Complete!** 🎉

Your BuildWise application is now live and ready to use.
