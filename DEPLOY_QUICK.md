# Quick Deployment Reference

## 🚀 Deploy to Vercel (Fastest Method)

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Deploy
```bash
vercel login
vercel
```

### 3. Add Environment Variables in Vercel Dashboard

Go to: **Project Settings → Environment Variables**

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
PERPLEXITY_API_KEY=your_perplexity_key
RESEND_API_KEY=your_resend_key (optional)
```

### 4. Update Supabase Redirect URLs

Go to: **Supabase Dashboard → Authentication → URL Configuration**

Add:
- Site URL: `https://your-app.vercel.app`
- Redirect URLs: `https://your-app.vercel.app/auth/callback`

### 5. Redeploy
```bash
vercel --prod
```

## ✅ Verification Checklist

- [ ] Build completes without errors
- [ ] Can sign up/login
- [ ] Can create projects
- [ ] Can generate contracts
- [ ] Can upload documents
- [ ] Can add payments

---

**See DEPLOYMENT.md for detailed instructions**
