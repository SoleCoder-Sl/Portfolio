# Razorpay Setup Guide

## Environment Variables Required

Create or update your `.env.local` file in the root directory with:

```env
# Server-side (for API routes)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_SECRET=your_secret_key_here

# Client-side (for shop page)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
```

**Important Notes:**
1. Both `RAZORPAY_KEY_ID` and `NEXT_PUBLIC_RAZORPAY_KEY_ID` should have the SAME value (your Razorpay Key ID)
2. `NEXT_PUBLIC_` prefix is REQUIRED for client-side access
3. No spaces around the `=` sign
4. No quotes needed (unless your key contains special characters)

## Steps to Fix "Razorpay is not configured" Error

### 1. Verify `.env.local` File Location
- File must be in the **root directory** (same level as `package.json`)
- File name must be exactly `.env.local` (not `.env`, not `.env.local.txt`)

### 2. Check Variable Names
- Must be exactly: `NEXT_PUBLIC_RAZORPAY_KEY_ID` (case-sensitive)
- Common mistakes:
  - ❌ `RAZORPAY_KEY_ID` (missing NEXT_PUBLIC_)
  - ❌ `next_public_razorpay_key_id` (wrong case)
  - ❌ `NEXT_PUBLIC_RAZORPAY_KEY` (missing _ID)

### 3. Restart Development Server
After adding/changing `.env.local`:
```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

### 4. Clear Next.js Cache (if still not working)
```bash
# Delete .next folder
rm -r .next  # On Windows: rmdir /s .next

# Restart server
npm run dev
```

### 5. Verify in Browser Console
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Refresh the shop page
4. Look for: `✅ Razorpay key found in client env` or `✅ Razorpay key fetched from API`
5. If you see `❌ Razorpay key not found`, check your `.env.local` file again

## Example `.env.local` File

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_ABC123xyz456
RAZORPAY_SECRET=secret_ABC123xyz456789
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_ABC123xyz456
```

## Testing

1. Make sure your dev server is running
2. Visit `/shop` page
3. Open browser console (F12)
4. Click "Purchase Now" on any product
5. You should see Razorpay payment modal (not an error)

## Troubleshooting

### Still seeing "Razorpay is not configured"?

1. **Check file location**: `.env.local` must be in root directory
2. **Check variable name**: Must be `NEXT_PUBLIC_RAZORPAY_KEY_ID`
3. **Restart server**: Always restart after changing `.env.local`
4. **Check for typos**: No extra spaces, correct spelling
5. **Verify key format**: Should start with `rzp_test_` or `rzp_live_`
6. **Clear cache**: Delete `.next` folder and restart

### Get Razorpay Keys

1. Login to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Go to Settings → API Keys
3. Generate/View Test Keys
4. Copy Key ID and Secret

