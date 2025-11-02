-- ============================================
-- Supabase Database Schema for Portfolio App
-- ============================================
-- Run these SQL commands in your Supabase SQL Editor
-- Dashboard → SQL Editor → New Query

-- ============================================
-- 1. User Profiles Table (Extended User Data)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 2. Projects Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('websites', 'apps', 'workflows')),
  image_url TEXT NOT NULL,
  live_url TEXT,
  github_url TEXT,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create index for faster category queries
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Policies for projects (public read, admin write)
CREATE POLICY "Anyone can view projects"
  ON public.projects FOR SELECT
  USING (true);

CREATE POLICY "Only authenticated users can insert projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update their own projects"
  ON public.projects FOR UPDATE
  USING (auth.role() = 'authenticated' AND created_by = auth.uid());

CREATE POLICY "Only authenticated users can delete their own projects"
  ON public.projects FOR DELETE
  USING (auth.role() = 'authenticated' AND created_by = auth.uid());

-- ============================================
-- 3. Products Table (Shop Items)
-- ============================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  price_display TEXT NOT NULL, -- e.g., "₹3,999"
  amount INTEGER NOT NULL, -- Price in paise (smallest currency unit)
  currency TEXT DEFAULT 'INR',
  category TEXT NOT NULL CHECK (category IN ('workflow', 'template')),
  tags TEXT[] DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(active);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Policies for products (public can view, admin can manage)
CREATE POLICY "Anyone can view active products"
  ON public.products FOR SELECT
  USING (active = true);

-- ============================================
-- 4. Orders Table (Razorpay Payments)
-- ============================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  razorpay_order_id TEXT UNIQUE NOT NULL,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  amount INTEGER NOT NULL, -- Amount in paise
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_data JSONB, -- Store additional payment metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON public.orders(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_payment_id ON public.orders(razorpay_payment_id);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policies for orders
CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own orders"
  ON public.orders FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- 5. Function to update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 6. Insert Sample Data (Optional)
-- ============================================
-- Uncomment and modify these if you want to seed initial data

-- Sample Projects
/*
INSERT INTO public.projects (title, description, category, image_url, live_url, github_url, tags, featured) VALUES
  ('E-Commerce Platform', 'A modern, fully-featured e-commerce platform built with Next.js and Stripe integration.', 'websites', 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&h=600&fit=crop', 'https://example.com', 'https://github.com/example', ARRAY['Next.js', 'Stripe', 'TypeScript', 'Tailwind CSS'], true),
  ('Automated Email Marketing', 'An n8n workflow that automates email marketing campaigns.', 'workflows', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop', 'https://example.com/blog/email-marketing-automation', NULL, ARRAY['n8n', 'Email Marketing', 'Automation'], true);
*/

-- Sample Products
/*
INSERT INTO public.products (title, description, image_url, price_display, amount, category, tags, active) VALUES
  ('Automated Email Marketing Workflow', 'A comprehensive n8n workflow that automates email marketing campaigns.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop', '₹3,999', 399900, 'workflow', ARRAY['n8n', 'Email Marketing', 'Automation'], true),
  ('Premium E-Commerce Template', 'A modern, fully-featured e-commerce website template built with Next.js 14 and TypeScript.', 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&h=600&fit=crop', '₹11,999', 1199900, 'template', ARRAY['Next.js', 'TypeScript', 'E-Commerce'], true);
*/

