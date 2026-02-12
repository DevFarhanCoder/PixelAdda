# Digital Design Marketplace - Production Deployment Guide

## 🚀 Production Checklist

### 1. MongoDB Atlas Setup (Required for Production)
- [ ] Create MongoDB Atlas account (free tier available)
- [ ] Create a new cluster
- [ ] Get connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)
- [ ] Update `MONGO_URL` in production environment

### 2. Environment Variables for Production

#### Backend (.env for Render):
```
MONGO_URL=mongodb+srv://your-atlas-connection-string
DB_NAME=design_marketplace
CORS_ORIGINS=https://your-vercel-domain.vercel.app
JWT_SECRET=your-super-secret-jwt-key-change-this
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
R2_ENDPOINT=https://939a2c080bbee03bf488a8813d17c767.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=b6eac80c2c800d1b85dd279a6404dff4
R2_SECRET_ACCESS_KEY=2a7590e3b7133c3669715b62a77807d8a28ed946035f8987491388c585a6b806
R2_BUCKET_NAME=design-marketplace
PORT=8001
```

#### Frontend (.env for Vercel):
```
REACT_APP_BACKEND_URL=https://your-render-backend.onrender.com
```

### 3. GitHub Setup

**Option 1: Using Emergent's "Save to GitHub"**
1. Click "Save to GitHub" button in Emergent interface
2. Authorize GitHub connection
3. Create new repository or select existing one
4. Code will be automatically pushed

**Option 2: Manual Git Push**
```bash
cd /app
git init
git add .
git commit -m "Initial commit - Design Marketplace"
git branch -M main
git remote add origin https://github.com/yourusername/design-marketplace.git
git push -u origin main
```

### 4. Vercel Deployment (Frontend)

1. **Connect Repository:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `frontend` folder as root directory

2. **Configure Build Settings:**
   - Framework Preset: `Create React App`
   - Build Command: `yarn build`
   - Output Directory: `build`
   - Install Command: `yarn install`

3. **Environment Variables:**
   - Add `REACT_APP_BACKEND_URL` with your Render backend URL

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Get your Vercel URL (e.g., `https://design-marketplace.vercel.app`)

### 5. Render Deployment (Backend)

1. **Create New Web Service:**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` folder as root directory

2. **Configure Service:**
   - Name: `design-marketplace-api`
   - Region: Choose closest to your users
   - Branch: `main`
   - Root Directory: `backend`
   - Runtime: `Node`
   - Build Command: `yarn install`
   - Start Command: `node server.js`

3. **Environment Variables:**
   Add all backend environment variables listed above

4. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment
   - Get your Render URL (e.g., `https://design-marketplace-api.onrender.com`)

5. **Update CORS:**
   - Go back to Render dashboard
   - Update `CORS_ORIGINS` environment variable with your Vercel URL

### 6. Database Migration

After MongoDB Atlas is set up:

```bash
# Run admin seeder on production
node backend/scripts/seedAdmin.js

# Run category seeder on production  
node backend/scripts/seedCategories.js
```

### 7. Final Steps

1. **Update Frontend with Backend URL:**
   - Update `REACT_APP_BACKEND_URL` in Vercel to your Render URL
   - Redeploy frontend

2. **Test Everything:**
   - [ ] Homepage loads with categories
   - [ ] Admin can login
   - [ ] Products can be uploaded
   - [ ] Images display correctly
   - [ ] Payment flow works (with Razorpay keys)
   - [ ] File downloads work

3. **Change Default Admin Password:**
   - Login to admin panel
   - Change from default `Admin@123` to secure password

4. **Configure Razorpay Webhook:**
   - Go to Razorpay Dashboard
   - Add webhook URL: `https://your-render-backend.onrender.com/api/payment/webhook`
   - Copy webhook secret to environment variables

## 📊 Cost Breakdown

- **MongoDB Atlas:** Free (M0 Sandbox - 512MB)
- **Vercel:** Free (Hobby plan with unlimited bandwidth)
- **Render:** Free tier available ($0/month, sleeps after 15 min inactivity) OR $7/month for always-on
- **Cloudflare R2:** $0.015/GB storage + $0.36/million requests (extremely cheap)

## 🔒 Security Recommendations

1. **Change JWT Secret:** Use a strong random string
2. **Enable HTTPS:** Both Vercel and Render provide SSL by default
3. **Rate Limiting:** Add rate limiting middleware for production
4. **Input Validation:** Already implemented with Mongoose schemas
5. **File Upload Limits:** Consider adding file size limits
6. **Backup Database:** Set up automated backups in MongoDB Atlas

## 🚨 Common Issues

**Issue:** CORS errors after deployment
**Solution:** Make sure `CORS_ORIGINS` in backend includes your Vercel URL

**Issue:** Environment variables not loading
**Solution:** Restart the Render service after adding/changing env vars

**Issue:** MongoDB connection fails
**Solution:** 
- Check Atlas IP whitelist (add 0.0.0.0/0 for all IPs or Render's IPs)
- Verify connection string format
- Ensure database user has correct permissions

**Issue:** Images not loading
**Solution:** Check R2 bucket permissions and CORS settings

## 📝 Alternative: Emergent Native Deployment

If you prefer simpler deployment:
- Use Emergent's built-in deployment (50 credits/month)
- Managed infrastructure, no external setup needed
- Automatic SSL, scaling, and monitoring

## 🎯 Production URLs (After Deployment)

- **Frontend:** `https://your-project.vercel.app`
- **Backend API:** `https://your-project.onrender.com`
- **Admin Panel:** `https://your-project.vercel.app/admin/login`

---

**Need Help?** Refer to:
- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
