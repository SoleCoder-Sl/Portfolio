# Supabase Database Setup Guide

## 📋 Overview

This guide will help you set up the database tables for your portfolio application in Supabase.

## 🚀 Quick Start

1. **Go to your Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Schema**
   - Copy the entire contents of `supabase_schema.sql`
   - Paste it into the SQL Editor
   - Click "Run" or press `Ctrl+Enter`

## 📊 Tables Created

### 1. **profiles**
Extended user profile data linked to Supabase Auth users.

**Columns:**
- `id` (UUID, Primary Key) - Links to `auth.users(id)`
- `full_name` (TEXT) - User's full name
- `avatar_url` (TEXT) - Profile picture URL
- `bio` (TEXT) - User biography
- `website` (TEXT) - Personal website
- `location` (TEXT) - User location
- `created_at`, `updated_at` (TIMESTAMPTZ) - Timestamps

**Features:**
- Automatically creates profile when user signs up
- Row Level Security enabled
- Users can update their own profiles

---

### 2. **projects**
Portfolio projects (websites, apps, workflows).

**Columns:**
- `id` (UUID, Primary Key)
- `title` (TEXT) - Project title
- `description` (TEXT) - Project description
- `category` (TEXT) - Must be: 'websites', 'apps', or 'workflows'
- `image_url` (TEXT) - Project image URL
- `live_url` (TEXT, Optional) - Live demo URL
- `github_url` (TEXT, Optional) - GitHub repository URL
- `tags` (TEXT[]) - Array of technology tags
- `featured` (BOOLEAN) - Mark as featured project
- `created_at`, `updated_at` (TIMESTAMPTZ)
- `created_by` (UUID) - User who created the project

**Features:**
- Indexed for fast category queries
- Row Level Security enabled
- Public can view, authenticated users can create/update their own

---

### 3. **products**
Shop products (n8n workflows, website templates).

**Columns:**
- `id` (UUID, Primary Key)
- `title` (TEXT) - Product title
- `description` (TEXT) - Product description
- `image_url` (TEXT) - Product image URL
- `price_display` (TEXT) - Display price (e.g., "₹3,999")
- `amount` (INTEGER) - Price in paise (smallest currency unit)
- `currency` (TEXT) - Currency code (default: 'INR')
- `category` (TEXT) - Must be: 'workflow' or 'template'
- `tags` (TEXT[]) - Array of tags
- `active` (BOOLEAN) - Whether product is active for sale
- `created_at`, `updated_at` (TIMESTAMPTZ)

**Features:**
- Indexed for fast category and active status queries
- Row Level Security enabled
- Only active products visible to public

---

### 4. **orders**
Razorpay payment orders and transactions.

**Columns:**
- `id` (UUID, Primary Key)
- `user_id` (UUID) - User who made the purchase
- `razorpay_order_id` (TEXT) - Razorpay order ID (unique)
- `razorpay_payment_id` (TEXT) - Razorpay payment ID
- `razorpay_signature` (TEXT) - Payment signature for verification
- `product_id` (UUID) - Reference to purchased product
- `amount` (INTEGER) - Amount in paise
- `currency` (TEXT) - Currency code (default: 'INR')
- `status` (TEXT) - 'pending', 'completed', 'failed', or 'refunded'
- `payment_data` (JSONB) - Additional payment metadata
- `created_at`, `updated_at` (TIMESTAMPTZ)

**Features:**
- Indexed for fast user and status queries
- Row Level Security enabled
- Users can only view their own orders

---

## 🔒 Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

- **profiles**: Users can view all, update/insert own
- **projects**: Public can view, authenticated can create, users can update own
- **products**: Public can view active products
- **orders**: Users can only view/update their own orders

## 🔄 Automatic Features

1. **Auto-create profile**: When a user signs up, a profile is automatically created
2. **Auto-update timestamps**: `updated_at` is automatically updated on record changes

## 📝 Next Steps

After running the SQL:

1. **Verify Tables Created:**
   - Go to "Table Editor" in Supabase Dashboard
   - You should see: `profiles`, `projects`, `products`, `orders`

2. **Test RLS Policies:**
   - Try creating a test user
   - Check if profile is auto-created

3. **Insert Sample Data (Optional):**
   - Uncomment the sample data inserts in the SQL file
   - Modify with your actual data
   - Run again

4. **Connect to Your App:**
   - The tables are ready to use with Supabase client
   - Example queries will be in your components

## 🛠️ Common Queries Examples

### Get all active products
```sql
SELECT * FROM public.products WHERE active = true ORDER BY created_at DESC;
```

### Get user's orders
```sql
SELECT o.*, p.title as product_title 
FROM public.orders o
LEFT JOIN public.products p ON o.product_id = p.id
WHERE o.user_id = auth.uid();
```

### Get projects by category
```sql
SELECT * FROM public.projects 
WHERE category = 'websites' 
ORDER BY created_at DESC;
```

## ⚠️ Important Notes

- Always test in a development environment first
- Backup your database before running migrations
- Review and adjust RLS policies based on your needs
- The `amount` field stores prices in **paise** (smallest currency unit)
  - ₹999 = 99900 paise
  - ₹1,999 = 199900 paise

## 🔧 Troubleshooting

If you encounter errors:

1. **Check Supabase Dashboard logs**
2. **Verify environment variables are set**
3. **Ensure RLS policies match your access needs**
4. **Check that triggers are created successfully**

