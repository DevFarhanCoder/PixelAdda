# Deployment Guide: Vercel (Frontend) + Render (Backend)

## 🎯 Quick Deployment Steps

### **Step 1: Deploy Backend to Render**

1. **Go to [Render](https://render.com)** and sign in
2. **Create New Web Service**
3. **Connect your repository**
4. **Configure:**
   - **Name**: `pixeladda-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or select paid for better performance)

5. **Add Environment Variables** (in Render dashboard):
   ```
   NODE_ENV=production
   MONGO_URL=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secret_key_here
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   CORS_ORIGINS=https://your-frontend-domain.vercel.app
   R2_ACCOUNT_ID=your_cloudflare_r2_account_id
   R2_ACCESS_KEY_ID=your_r2_access_key
   R2_SECRET_ACCESS_KEY=your_r2_secret_key
   R2_BUCKET_NAME=your_bucket_name
   ```

6. **Deploy** and copy your backend URL (e.g., `https://pixeladda-backend.onrender.com`)

---

### **Step 2: Deploy Frontend to Vercel**

1. **Go to [Vercel](https://vercel.com)** and sign in
2. **Import Project**
3. **Connect your repository**
4. **Configure:**
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (leave default)
   - **Output Directory**: `build` (leave default)
   - **Install Command**: `npm install` (leave default)

5. **Add Environment Variable**:
   ```
   REACT_APP_BACKEND_URL=https://your-backend-url.onrender.com
   ```
   ⚠️ **Important**: Replace with your actual Render backend URL from Step 1

6. **Deploy**

---

### **Step 3: Update Backend CORS**

After deploying frontend, update the `CORS_ORIGINS` environment variable in Render:

```
CORS_ORIGINS=https://your-actual-frontend.vercel.app
```

Then **trigger a redeployment** in Render.

---

## 📋 Environment Variables Checklist

### **Backend (Render)**
- ✅ `NODE_ENV` → `production`
- ✅ `MONGO_URL` → MongoDB Atlas connection string
- ✅ `JWT_SECRET` → Random secure string
- ✅ `RAZORPAY_KEY_ID` → From Razorpay dashboard
- ✅ `RAZORPAY_KEY_SECRET` → From Razorpay dashboard
- ✅ `CORS_ORIGINS` → Your Vercel frontend URL
- ✅ `R2_ACCOUNT_ID` → Cloudflare R2 account ID
- ✅ `R2_ACCESS_KEY_ID` → R2 access key
- ✅ `R2_SECRET_ACCESS_KEY` → R2 secret key
- ✅ `R2_BUCKET_NAME` → R2 bucket name

### **Frontend (Vercel)**
- ✅ `REACT_APP_BACKEND_URL` → Your Render backend URL

---

## 🔧 Troubleshooting

### **CORS Errors**
- Make sure `CORS_ORIGINS` in backend matches your exact Vercel URL
- No trailing slash in the URL
- Redeploy backend after changing CORS settings

### **Backend Not Responding**
- Check Render logs for errors
- Verify MongoDB Atlas connection string
- Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0) for Render

### **Frontend Can't Connect to Backend**
- Double-check `REACT_APP_BACKEND_URL` in Vercel
- Must start with `https://` (not `http://`)
- Redeploy frontend after changing environment variables

### **Images Not Loading**
- Verify Cloudflare R2 credentials in backend
- Check R2 bucket permissions (public access enabled)
- Review backend logs for R2 connection errors

---

## 🚀 Post-Deployment Tasks

1. **Test the application** thoroughly
2. **Seed admin account**: Use Render Shell or connect via SSH
   ```bash
   npm run seed:admin
   npm run seed:categories
   ```
3. **Set up custom domain** (optional)
   - Configure Vercel domain for frontend
   - Configure Render domain for backend
   - Update environment variables accordingly
4. **Monitor logs** in both Render and Vercel dashboards

---

## 📊 Deployment Architecture

```
┌─────────────────┐
│   Vercel        │
│   (Frontend)    │──────┐
│   React App     │      │
└─────────────────┘      │
                         │ HTTPS Requests
┌─────────────────┐      │
│   Render        │◄─────┘
│   (Backend)     │
│   Node.js API   │
└─────────────────┘
         │
         ├──► MongoDB Atlas (Database)
         │
         └──► Cloudflare R2 (File Storage)
```

---

## 💡 Tips

- **Free Tier Limitations**: 
  - Render free tier spins down after 15 mins of inactivity
  - First request after spin-down takes ~30 seconds
  - Consider upgrading for production use

- **Auto-Deploy**: 
  - Both Vercel and Render support auto-deploy from GitHub
  - Push to main branch → automatic deployment

- **Environment Variables**: 
  - Never commit `.env` files
  - Always use the platform's environment variable settings

---

## 🔐 Security Reminders

- ✅ Use strong `JWT_SECRET` (generate random string)
- ✅ Never expose API keys in frontend code
- ✅ Enable MongoDB Atlas IP whitelist (or use 0.0.0.0/0 for Render)
- ✅ Use HTTPS for all connections
- ✅ Keep dependencies updated

---

**Need Help?** Check the platform-specific documentation:
- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
