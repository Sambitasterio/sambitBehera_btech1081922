# Deployment Troubleshooting Guide

## Issue: "Cannot connect to backend server" Error

If you're seeing this error when using the production URL, follow these steps:

### 1. Verify Backend is Running

Check if your backend is accessible:
- Open: https://sambitbehera-btech1081922.onrender.com/
- You should see: `{"message":"API is running","timestamp":"..."}`

If you get an error or timeout:
- Check Render dashboard for backend service status
- Verify backend service is not sleeping (free tier services sleep after inactivity)
- Check backend logs in Render dashboard for errors

### 2. Check Frontend Environment Variables

In your Render frontend service, ensure these environment variables are set:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=https://sambitbehera-btech1081922.onrender.com/api
```

**Important**: After adding/changing environment variables in Render:
1. Go to your frontend service in Render
2. Click "Manual Deploy" → "Deploy latest commit"
3. This rebuilds the app with new environment variables

### 3. Check Backend Environment Variables

In your Render backend service, ensure these are set:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (optional)
NODE_ENV=production
PORT=10000 (or whatever Render assigns)
```

### 4. Verify CORS Configuration

The backend should allow requests from:
- `https://sambitbehera-btech1081922-1.onrender.com` (your frontend)
- `https://sambitbehera-btech1081922.onrender.com` (backend itself)

Check `backend/src/server.js` - CORS origins should include your frontend URL.

### 5. Check Browser Console

Open browser DevTools (F12) and check:
- **Console tab**: Look for API errors and the logged API URL
- **Network tab**: Check if requests to backend are:
  - Being sent (status: pending/failed)
  - Getting CORS errors (red, blocked by CORS policy)
  - Getting 404/500 errors

### 6. Common Issues

#### Backend Service is Sleeping (Free Tier)
- **Symptom**: First request takes 30-60 seconds
- **Solution**: Upgrade to paid plan or wait for service to wake up
- **Workaround**: Use a service like UptimeRobot to ping your backend every 5 minutes

#### CORS Error
- **Symptom**: Browser console shows "CORS policy" error
- **Solution**: Verify frontend URL is in backend CORS allowed origins
- **Check**: `backend/src/server.js` CORS configuration

#### Environment Variables Not Set
- **Symptom**: App uses default localhost URLs
- **Solution**: Set `VITE_API_URL` in Render frontend environment variables
- **Important**: Rebuild frontend after adding environment variables

#### Network Timeout
- **Symptom**: Requests timeout after 30 seconds
- **Solution**: Check backend logs for slow queries or database issues
- **Check**: Supabase connection and query performance

### 7. Testing Steps

1. **Test Backend Directly**:
   ```bash
   curl https://sambitbehera-btech1081922.onrender.com/
   ```
   Should return: `{"message":"API is running",...}`

2. **Test Backend API with Auth**:
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        https://sambitbehera-btech1081922.onrender.com/api/tasks
   ```

3. **Check Frontend Build**:
   - Open browser console
   - Look for: `🔗 API Base URL: https://sambitbehera-btech1081922.onrender.com/api`
   - If you see `localhost:3000`, environment variables are not set correctly

### 8. Quick Fixes

**If backend is sleeping:**
- Wait 30-60 seconds for first request
- Or upgrade Render plan

**If CORS error:**
- Add frontend URL to backend CORS origins
- Redeploy backend

**If environment variables missing:**
- Add `VITE_API_URL` to Render frontend environment variables
- Rebuild frontend service

**If still not working:**
- Check Render service logs
- Verify Supabase credentials are correct
- Ensure database tables exist (run `supabase_schema.sql`)

## Need More Help?

1. Check Render service logs
2. Check browser console for detailed errors
3. Verify all environment variables are set
4. Test backend endpoint directly
5. Check Supabase project is active
