# 🚀 Deploy Updated Frontend to Fix Backend Connection Error

## Quick Fix Steps

### Step 1: Commit and Push Your Changes

```bash
# Make sure you're in the project root
cd "C:\Users\SAMBIT\OneDrive\Desktop\task management"

# Check what files changed
git status

# Add all changes
git add .

# Commit the changes
git commit -m "Fix: Update error messages and API URL for production deployment"

# Push to your repository
git push
```

### Step 2: Verify Environment Variables in Render

1. Go to your Render dashboard: https://dashboard.render.com
2. Click on your **Frontend** service (the one at `sambitbehera-btech1081922-1.onrender.com`)
3. Go to **Environment** tab
4. **VERIFY** these environment variables exist:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_API_URL=https://sambitbehera-btech1081922.onrender.com/api
   ```
5. If `VITE_API_URL` is missing, **ADD IT NOW**:
   - Click "Add Environment Variable"
   - Key: `VITE_API_URL`
   - Value: `https://sambitbehera-btech1081922.onrender.com/api`
   - Click "Save Changes"

### Step 3: Trigger New Deployment

**Option A: Auto-Deploy (if connected to GitHub)**
- Render will automatically detect the new commit and start deploying
- Go to your frontend service → "Events" tab to see the deployment progress

**Option B: Manual Deploy**
1. In your Render frontend service dashboard
2. Click "Manual Deploy" → "Deploy latest commit"
3. Wait for build to complete (usually 2-5 minutes)

### Step 4: Verify Backend is Running

While waiting for frontend to deploy, check your backend:

1. Open: https://sambitbehera-btech1081922.onrender.com/
2. Should see: `{"message":"API is running","timestamp":"..."}`
3. If you get an error or timeout:
   - Backend might be sleeping (free tier)
   - Wait 30-60 seconds and try again
   - Check Render backend service logs

### Step 5: Test After Deployment

1. Wait for frontend deployment to complete (check Render dashboard)
2. Clear your browser cache (Ctrl+Shift+Delete) or use Incognito mode
3. Visit: https://sambitbehera-btech1081922-1.onrender.com/dashboard
4. Open browser DevTools (F12) → Console tab
5. Look for: `🔗 API Base URL: https://sambitbehera-btech1081922.onrender.com/api`
6. If you see `localhost:3000`, the environment variable is not set correctly

## What Changed?

✅ Error messages now show the actual API URL instead of "port 3000"
✅ Default API URL is set to production backend
✅ Better error logging in console
✅ 30-second timeout for production requests

## Still Getting Errors?

If you still see the error after deploying:

1. **Check Browser Console** (F12):
   - Look for the logged API URL
   - Check for CORS errors
   - Check for network errors

2. **Verify Backend**:
   - Test: https://sambitbehera-btech1081922.onrender.com/
   - Should return JSON, not an error

3. **Check Render Logs**:
   - Frontend build logs: Look for build errors
   - Backend logs: Look for runtime errors

4. **Environment Variables**:
   - Double-check `VITE_API_URL` is set correctly
   - Make sure there are no typos
   - Rebuild after adding/changing variables

## Need Help?

Check `DEPLOYMENT_TROUBLESHOOTING.md` for detailed troubleshooting steps.
