# Rakesh Portfolio

A modern, responsive portfolio website built with Next.js 14, TypeScript, Tailwind CSS, and Supabase. Features include authentication, payment integration with Razorpay, and a beautiful glassmorphism design.

## 🚀 Features

- **Modern Stack**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Authentication**: Supabase Auth with social login (Google, GitHub)
- **Payment Integration**: Razorpay for secure payments
- **Responsive Design**: Fully responsive, works on all devices
- **Performance**: Optimized images, lazy loading, and code splitting
- **Beautiful UI**: Glassmorphism effects, smooth animations with Framer Motion
- **SEO Optimized**: Server-side rendering and metadata optimization

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account
- Razorpay account (for shop functionality)

## 🔧 Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd rakeshportfolio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your environment variables in `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret
```

### 4. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `supabase_schema.sql` in your Supabase SQL Editor
3. Configure OAuth providers in Supabase Dashboard → Authentication → Providers
4. Set up Storage bucket for avatars (see `SUPABASE_STORAGE_SETUP.md`)

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## 📱 Build for Production

```bash
npm run build
npm start
```

## 🚢 Deploy to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

### Option 2: Deploy via GitHub

1. Push your code to GitHub
2. Import your repository in [Vercel Dashboard](https://vercel.com)
3. Add environment variables in Vercel Dashboard:
   - Go to Settings → Environment Variables
   - Add all variables from `.env.local`
4. Deploy

### Environment Variables in Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_SECRET`

**Important**: 
- Variables starting with `NEXT_PUBLIC_` are exposed to the browser
- Variables without `NEXT_PUBLIC_` are server-side only (keep secrets secure!)

## 📂 Project Structure

```
rakeshportfolio/
├── app/                    # Next.js App Router pages
│   ├── about/             # About Me page
│   ├── api/               # API routes
│   ├── profile/           # User profile page
│   ├── projects/          # Projects showcase
│   ├── shop/              # Shop page with Razorpay
│   └── sign-in/           # Authentication page
├── components/            # React components
│   ├── AuthForm.tsx       # Sign in/up form
│   ├── ContactModal.tsx   # Contact modal
│   ├── HeroSection.tsx    # Homepage hero
│   ├── Sidebar.tsx        # Navigation sidebar
│   └── ...
├── context/               # React Context providers
│   └── AuthContext.tsx    # Authentication context
├── lib/                   # Utility libraries
│   └── supabaseClient.ts  # Supabase client
├── public/                # Static assets
└── ...
```

## 🎨 Customization

### Update Colors

Edit `tailwind.config.ts` to customize the color scheme.

### Update Content

- **Projects**: Edit `app/projects/page.tsx`
- **Shop Products**: Edit `app/shop/page.tsx`
- **About Me**: Edit `app/about/page.tsx`
- **Hero Section**: Edit `components/HeroSection.tsx`

### Update Social Links

Edit `components/ContactModal.tsx` to update social media links.

## 🔒 Security Notes

- Never commit `.env.local` to version control
- Keep `RAZORPAY_SECRET` and other secrets server-side only
- Use `NEXT_PUBLIC_` prefix only for variables needed client-side
- Enable Row Level Security (RLS) in Supabase for database tables

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Razorpay Documentation](https://razorpay.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🐛 Troubleshooting

### Build Errors

- Make sure all environment variables are set
- Check that all dependencies are installed: `npm install`
- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`

### Razorpay Issues

- Verify API keys are correct
- Check that Razorpay script is loaded in `app/layout.tsx`
- Ensure server-side routes have access to `RAZORPAY_SECRET`

### Supabase Issues

- Verify project URL and anon key are correct
- Check that RLS policies are set up correctly
- Ensure OAuth providers are configured in Supabase Dashboard

## 📝 License

This project is private and proprietary.

## 🤝 Support

For issues or questions, please contact: me@rakeshcodes.in
