# Supabase Authentication Guide

## 🔍 Where to Find Users in Supabase

**Important:** Supabase Auth users are NOT in the Table Editor. They are in:

1. **Supabase Dashboard** → **Authentication** → **Users**
   - This shows all registered users
   - You'll see: Email, Created At, Last Sign In, etc.
   - Email and password hash are stored here (password is never visible for security)

2. **Table Editor** → **profiles** table
   - This only shows extended metadata (full_name, bio, etc.)
   - Created automatically when a user signs up (via trigger)

## ✅ Email Confirmation Issue

Supabase requires email confirmation by default. Here's how to handle it:

### Option 1: Disable Email Confirmation (Development)

1. Go to **Supabase Dashboard** → **Authentication** → **Settings**
2. Find **"Enable email confirmations"**
3. **Turn it OFF** for development/testing
4. Click **Save**

### Option 2: Keep Email Confirmation Enabled (Production)

If email confirmation is enabled:
- Users receive a confirmation email after signup
- They must click the link in the email to confirm
- Only confirmed users can sign in
- Check spam folder if email doesn't arrive

## 🛠️ Troubleshooting Sign In Issues

### Check 1: Verify User Exists
1. Go to **Authentication** → **Users**
2. Find your user by email
3. Check **"Email Confirmed"** status
   - If **false**: User needs to confirm email
   - If **true**: User should be able to sign in

### Check 2: Check Browser Console
1. Open Developer Tools (F12)
2. Go to **Console** tab
3. Try signing in
4. Look for error messages

### Check 3: Verify Environment Variables
Make sure `.env.local` has:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**Then restart your dev server:**
```bash
# Stop server (Ctrl+C)
npm run dev
```

### Check 4: Test Direct Supabase Call
Open browser console and run:
```javascript
// Check if Supabase client works
const { createClient } = require('@supabase/supabase-js')
// Or test in browser console after importing
```

## 📝 Manual User Creation (For Testing)

If you need to create a test user manually:

1. Go to **Authentication** → **Users** → **Add User**
2. Enter email and password
3. Click **Create User**
4. If email confirmation is enabled, manually confirm:
   - Click on the user
   - Click **"Confirm Email"** button

## 🔑 Password Reset

If a user forgets their password:

1. Use Supabase's built-in password reset flow
2. User clicks "Forgot Password" on sign-in page
3. They receive reset email
4. They set new password via email link

## 🚨 Common Issues

### Issue: "Invalid login credentials"
- **Cause**: Wrong email or password, or email not confirmed
- **Fix**: 
  - Verify email/password are correct
  - Check if email is confirmed in Supabase Dashboard
  - Reset password if needed

### Issue: "Email not confirmed"
- **Cause**: Email confirmation required but user hasn't confirmed
- **Fix**: 
  - Disable email confirmation in settings, OR
  - Manually confirm user in Dashboard → Users → Click user → Confirm Email

### Issue: "User not found after signup"
- **Cause**: Looking in wrong place
- **Fix**: Check **Authentication** → **Users** (not Table Editor)

### Issue: "Sign in works but user not showing in sidebar"
- **Cause**: AuthContext not updating
- **Fix**: 
  - Check browser console for errors
  - Verify AuthProvider is wrapping your app in `layout.tsx`
  - Restart dev server

## 📊 Database Structure

```
auth.users (System Table - Supabase manages this)
├── id (UUID)
├── email (TEXT)
├── encrypted_password (encrypted - never visible)
├── email_confirmed_at (TIMESTAMPTZ)
└── created_at, updated_at

profiles (Custom Table - Your extended data)
├── id (UUID) → references auth.users(id)
├── full_name (TEXT)
├── avatar_url (TEXT)
└── ... (other profile fields)
```

## ✅ Quick Verification Steps

1. **Sign up a new user**
   - Check **Authentication** → **Users** → User should appear
   - Check **Table Editor** → **profiles** → Profile should auto-create

2. **Check email confirmation status**
   - In **Users** table, check "Email Confirmed" column

3. **Test sign in**
   - Use the same email/password
   - Check browser console for errors
   - Should redirect to home page if successful

4. **Check auth state**
   - After sign in, sidebar should show user's name/email
   - If not, check browser console for AuthContext errors

