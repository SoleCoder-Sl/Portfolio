# Supabase Storage Setup for Avatar Uploads

## 🪣 Create the Avatars Storage Bucket

The profile page needs a storage bucket to upload avatars. Follow these steps:

### Step 1: Create Storage Bucket

1. Go to **Supabase Dashboard** → **Storage**
2. Click **"New bucket"**
3. Configure:
   - **Name**: `avatars`
   - **Public bucket**: ✅ **Check this** (so images can be accessed)
   - Click **"Create bucket"**

### Step 2: Set Up Bucket Policies

After creating the bucket, you need to set permissions:

1. Click on the **`avatars`** bucket
2. Go to **"Policies"** tab
3. Click **"New Policy"**
4. Select **"For full customization"**
5. Add this policy for uploads:

```sql
-- Policy: Allow authenticated users to upload avatars
CREATE POLICY "Users can upload their own avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
```

6. Add this policy for public read:

```sql
-- Policy: Allow public to read avatars
CREATE POLICY "Public avatar access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

### Alternative: Use Supabase Dashboard

1. Go to **Storage** → **`avatars`** → **Policies**
2. Click **"New Policy"**
3. Choose **"Allow public uploads"** or **"Allow authenticated uploads"**
4. For authenticated uploads, use this SQL:

```sql
(bucket_id = 'avatars')
```

## ✅ Test Upload

After setup, try uploading an avatar from the profile page. If it fails, check:

1. **Bucket exists**: Storage → You should see `avatars` bucket
2. **Bucket is public**: Settings → Public bucket = ON
3. **Policies are set**: Policies tab → Should have policies listed

## 🔒 Security Notes

- **Public bucket** means anyone can view avatars (needed for displaying images)
- **Authenticated uploads** means only logged-in users can upload
- Files are organized by user ID in the path: `{user_id}/{timestamp}.{ext}`

