# 🚀 Vercel Deployment Checklist

## ✅ Pre-Deployment

- [x] Build succeeds locally (`npm run build`)
- [x] All TypeScript errors resolved
- [x] All pages marked with `export const dynamic = 'force-dynamic'` where needed
- [x] Suspense boundaries added for `useSearchParams()`
- [x] Image optimization configured in `next.config.js`
- [x] Responsive design tested on mobile/tablet/desktop

## 📋 Environment Variables Setup

### In Vercel Dashboard:

1. Go to your project → **Settings** → **Environment Variables**
2. Add the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret
```

### Important Notes:

- ✅ Variables starting with `NEXT_PUBLIC_` are **client-side** (exposed to browser)
- 🔒 Variables without `NEXT_PUBLIC_` are **server-side only** (secure)
- Set these for **Production**, **Preview**, and **Development** environments

## 🔧 Supabase Setup

1. **Database Schema**: Run `supabase_schema.sql` in Supabase SQL Editor
2. **Storage Bucket**: Create `avatars` bucket (see `SUPABASE_STORAGE_SETUP.md`)
3. **OAuth Providers**: Configure Google/GitHub in Supabase Dashboard
4. **RLS Policies**: Ensure Row Level Security is enabled

## 💳 Razorpay Setup

1. Add callback URLs in Razorpay Dashboard:
   - Success: `https://your-domain.vercel.app/shop?payment=success`
   - Failure: `https://your-domain.vercel.app/shop?payment=failed`

## 🚢 Deploy Steps

### Option 1: GitHub Integration (Recommended)

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com)
3. Click **"Add New Project"**
4. Import your GitHub repository
5. Vercel will auto-detect Next.js
6. Add environment variables (see above)
7. Click **"Deploy"**

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# For production
vercel --prod
```

## ✅ Post-Deployment Checks

- [ ] Homepage loads correctly
- [ ] Navigation works on all devices
- [ ] Projects page displays correctly
- [ ] Shop page loads products
- [ ] Razorpay checkout works (test mode)
- [ ] Sign-in/Sign-up works
- [ ] Profile page accessible when logged in
- [ ] About Me page displays correctly
- [ ] Images load properly
- [ ] Responsive design works on mobile

## 🐛 Troubleshooting

### Build Fails
- Check environment variables are set
- Verify `next.config.js` is correct
- Check for TypeScript errors locally first

### Images Not Loading
- Verify `next.config.js` has correct `remotePatterns`
- Check image URLs are accessible
- Ensure images are properly imported or use full URLs

### Razorpay Not Working
- Verify API keys are correct
- Check Razorpay script loads in `app/layout.tsx`
- Ensure callback URLs are set in Razorpay Dashboard

### Authentication Issues
- Verify Supabase URL and keys
- Check OAuth providers are configured
- Ensure email confirmation is disabled or handled

## 📱 Mobile Testing

Test on:
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Mobile viewports (320px - 768px)
- [ ] Tablet viewports (768px - 1024px)

## 🔒 Security Checklist

- [ ] `.env.local` is in `.gitignore`
- [ ] No secrets in code or commits
- [ ] RLS enabled in Supabase
- [ ] API routes protected server-side
- [ ] Razorpay secret never exposed client-side

## 📊 Performance

- [ ] Lighthouse score > 90
- [ ] Images optimized
- [ ] Code splitting working
- [ ] No console errors in production

---

**Ready to deploy! 🚀**

