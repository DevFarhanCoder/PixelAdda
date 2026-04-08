# Deployment Checklist & Migration Guide

## 📋 Pre-Deployment Checklist

### Backend Changes

#### 1. Database Models Updated

- [ ] `User.js` - Added subscription fields (subscriptionPlan, subscriptionStatus, downloadHistory, etc.)
- [ ] `Product.js` - Added tags, trending metrics, isPremium, SEO fields
- [ ] `Subscription.js` - New model for subscription plans

#### 2. New Backend Files Created

- [ ] `models/Subscription.js` - Subscription plan and history models
- [ ] `routes/subscriptions.js` - Subscription management routes
- [ ] `utils/subscriptionHelper.js` - Download limit logic
- [ ] `scripts/seedSubscriptionPlans.js` - Seed subscription data

#### 3. Updated Backend Files

- [ ] `server.js` - Added subscription routes
- [ ] `routes/products.js` - Added trending/featured/tags endpoints
- [ ] `routes/downloads.js` - Added subscription limit checking
- [ ] `routes/admin.js` - Enhanced analytics and subscription management

### Frontend Changes

#### 1. New Frontend Pages

- [ ] `pages/PricingPage.js` - Subscription plans page
- [ ] `pages/HomePage.js` - Redesigned Freepik-style homepage
- [ ] `pages/UserDashboard.js` - Enhanced with subscription tracking
- [ ] `pages/ProductDetailPage.js` - Enhanced with better preview

#### 2. New Components

- [ ] `components/SEO.js` - SEO meta tags component

#### 3. Updated Files

- [ ] `App.js` - Added /pricing route
- [ ] `components/Navbar.js` - Added Pricing link

## 🚀 Deployment Steps

### Step 1: Backend Deployment

1. **Update Environment Variables**

   ```bash
   # Add these if not already present
   MONGO_URL=your_mongodb_url
   DB_NAME=pixeladda
   JWT_SECRET=your_jwt_secret
   R2_ENDPOINT=your_r2_endpoint
   R2_ACCESS_KEY_ID=your_access_key
   R2_SECRET_ACCESS_KEY=your_secret_key
   R2_BUCKET_NAME=your_bucket_name
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   CORS_ORIGINS=https://yourfrontend.com
   ```

2. **Run Database Seeds**

   ```bash
   cd backend
   node scripts/seedSubscriptionPlans.js
   ```

   This will create the 4 subscription plans (Free, Basic, Premium, Enterprise)

3. **Deploy Backend**
   - Push to your Git repository
   - Deploy to Render/Railway/Heroku
   - Verify deployment is successful

4. **Test API Endpoints**

   ```bash
   # Test subscription plans
   curl https://your-api.com/api/subscriptions/plans

   # Test trending products
   curl https://your-api.com/api/products/special/trending

   # Test admin stats (with auth token)
   curl -H "Authorization: Bearer YOUR_TOKEN" https://your-api.com/api/admin/stats
   ```

### Step 2: Frontend Deployment

1. **Install New Dependencies**

   ```bash
   cd frontend
   npm install react-helmet-async
   ```

2. **Update Environment Variables**

   ```bash
   REACT_APP_BACKEND_URL=https://your-api.com
   ```

3. **Build and Deploy**
   ```bash
   npm run build
   ```

   - Deploy to Vercel/Netlify
   - Verify build is successful

### Step 3: Post-Deployment

1. **Verify Core Functionality**
   - [ ] Homepage loads with trending/featured sections
   - [ ] Product detail pages show enhanced preview
   - [ ] Pricing page displays all plans
   - [ ] User dashboard shows subscription info
   - [ ] Downloads respect subscription limits
   - [ ] Search and filtering works
   - [ ] Admin panel shows analytics

2. **Test User Flows**
   - [ ] Free user can browse and download (3/month limit)
   - [ ] User can view pricing and see plan details
   - [ ] User can upgrade to premium (test payment)
   - [ ] Premium user can download unlimited (or plan limit)
   - [ ] Download history tracks correctly
   - [ ] Monthly limits reset properly

3. **Test Admin Flows**
   - [ ] Admin can upload new products
   - [ ] Admin can add tags to products
   - [ ] Admin can mark products as premium/featured
   - [ ] Admin can view analytics
   - [ ] Admin can manage user subscriptions

## 🔄 Database Migration

### For Existing Users

If you have existing data, run these updates:

```javascript
// Add default values to existing users
db.users.updateMany(
  {},
  {
    $set: {
      subscriptionPlan: "free",
      subscriptionStatus: "active",
      monthlyDownloads: 0,
      lastDownloadReset: new Date(),
      downloadHistory: [],
    },
  },
);

// Add default values to existing products
db.products.updateMany(
  {},
  {
    $set: {
      tags: [],
      isPremium: false,
      requiredPlan: "free",
      views: 0,
      likes: 0,
      trendingScore: 0,
      isTrending: false,
      isFeatured: false,
    },
  },
);
```

## 📊 Monitoring After Deployment

### Key Metrics to Watch

1. **Performance**
   - Homepage load time (should be < 3s)
   - Product detail page load time
   - API response times
   - Download speeds

2. **Functionality**
   - Download limit enforcement
   - Subscription plan changes
   - Payment processing
   - File delivery

3. **Errors**
   - Check server logs for errors
   - Monitor frontend console for errors
   - Check download failures
   - Monitor payment failures

## 🆘 Rollback Plan

If issues occur:

1. **Revert Frontend**

   ```bash
   # Redeploy previous version
   git revert HEAD
   git push origin main
   ```

2. **Revert Backend**

   ```bash
   # Rollback to previous deployment
   # Or disable new routes temporarily
   ```

3. **Database Rollback**
   - Restore from backup if needed
   - Remove new fields if causing issues

## ✅ Success Criteria

Deployment is successful when:

- [ ] All pages load without errors
- [ ] Users can browse and search products
- [ ] Subscription plans are visible and accurate
- [ ] Downloads work with proper limits
- [ ] Payment flow works (test mode)
- [ ] Admin panel is accessible and functional
- [ ] Analytics show correct data
- [ ] Mobile responsive design works
- [ ] SEO meta tags are present

## 📝 Notes

- **Backup**: Always backup your database before deployment
- **Testing**: Test in staging environment first
- **Monitoring**: Set up error tracking (Sentry, LogRocket)
- **Analytics**: Set up Google Analytics or similar
- **Performance**: Use Lighthouse to check performance scores

## 🎯 Next Steps After Deployment

1. Monitor user behavior and feedback
2. Test subscription conversion rates
3. Optimize popular pages for performance
4. Add more payment gateway options if needed
5. Implement email notifications for subscriptions
6. Add more analytics and reporting
7. Consider A/B testing pricing tiers
8. Collect user feedback on new features

---

## Quick Reference Commands

### Backend

```bash
# Start development server
npm start

# Seed subscription plans
node scripts/seedSubscriptionPlans.js

# Seed admin user
node scripts/seedAdmin.js
```

### Frontend

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Database

```bash
# Connect to MongoDB
mongosh "your_connection_string"

# Check subscription plans
db.subscriptionplans.find().pretty()

# Check users with subscriptions
db.users.find({ subscriptionPlan: { $ne: 'free' }}).pretty()
```

---

Good luck with your deployment! 🚀
