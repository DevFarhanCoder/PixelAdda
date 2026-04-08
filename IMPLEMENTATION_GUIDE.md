# PixelAdda - Premium Stock Asset Marketplace

A modern, Freepik-like stock asset marketplace built with the MERN stack (MongoDB, Express, React, Node.js). This platform offers a freemium model with subscription plans, allowing users to download design assets including vectors, rasters, templates, and more.

## 🚀 Features

### User Features

- **Freemium Model**: Free tier with limited downloads + Premium subscriptions
- **Subscription Plans**: Free, Basic, Premium, and Enterprise tiers
- **Smart Search**: Search assets by title, tags, or description
- **Category Browsing**: Organized asset categories for easy navigation
- **Trending Assets**: Algorithm-based trending content discovery
- **Featured Content**: Curated premium assets
- **Download Tracking**: Track download history and usage limits
- **User Dashboard**: View subscription status, downloads, and purchase history
- **Lazy Loading**: Optimized image loading for better performance
- **SEO Optimized**: Meta tags and semantic HTML for search engines

### Admin Features

- **Content Management**: Upload and manage assets (images, vectors, videos)
- **User Management**: View and modify user subscriptions
- **Analytics Dashboard**: Comprehensive stats on downloads, revenue, users
- **Tag Management**: Add and manage tags for better discoverability
- **Premium Controls**: Mark assets as premium or featured
- **Subscription Management**: Handle user subscriptions and billing

### Technical Features

- **JWT Authentication**: Secure user authentication
- **Cloudflare R2 Storage**: Scalable asset storage
- **Multiple File Formats**: Support for EPS, AI, CDR, PSD, JPEG, PNG, MP4, etc.
- **Download Limits**: Subscription-based download restrictions
- **Payment Integration**: Razorpay payment gateway support
- **Responsive Design**: Mobile-first, fully responsive UI
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- Cloudflare R2 account (or AWS S3 compatible storage)
- Razorpay account (for payments)

## 🛠️ Installation

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with the following variables:

```env
# Server
PORT=8001
NODE_ENV=development

# MongoDB
MONGO_URL=your_mongodb_connection_string
DB_NAME=pixeladda

# JWT
JWT_SECRET=your_jwt_secret_key

# Cloudflare R2 / S3
R2_ENDPOINT=your_r2_endpoint
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_URL=your_public_url

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# CORS
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
```

4. Seed the database:

```bash
# Seed subscription plans
node scripts/seedSubscriptionPlans.js

# Seed admin user (if needed)
node scripts/seedAdmin.js

# Seed categories (if needed)
node scripts/seedCategories.js
```

5. Start the server:

```bash
npm start
```

The backend will run on `http://localhost:8001`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

4. Install react-helmet-async for SEO:

```bash
npm install react-helmet-async
```

5. Start the development server:

```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 📦 Subscription Plans

### Free Plan

- 3 downloads per month
- Access to free assets
- Standard license
- Community support

### Basic Plan (₹499/month)

- 20 downloads per month
- Access to free assets
- Commercial use license
- Priority support

### Premium Plan (₹999/month)

- 100 downloads per month
- Access to ALL premium assets
- AI-powered tools
- Commercial use license
- Priority support

### Enterprise Plan (₹2999/month)

- Unlimited downloads
- Access to ALL premium assets
- AI-powered tools
- Dedicated account manager
- Custom licensing

## 🎨 Project Structure

```
PixelAdda/
├── backend/
│   ├── models/              # MongoDB schemas
│   │   ├── User.js         # User model with subscription fields
│   │   ├── Product.js      # Product model with tags, trending
│   │   ├── Category.js
│   │   ├── Order.js
│   │   └── Subscription.js # Subscription plans model
│   ├── routes/             # API routes
│   │   ├── auth.js
│   │   ├── products.js     # Products + trending/featured endpoints
│   │   ├── downloads.js    # Download with limit checking
│   │   ├── subscriptions.js # Subscription management
│   │   ├── admin.js        # Admin analytics & management
│   │   └── ...
│   ├── middleware/         # Auth middleware
│   ├── utils/              # Utility functions
│   │   ├── subscriptionHelper.js # Download limit logic
│   │   ├── r2Storage.js
│   │   └── ...
│   ├── scripts/            # Database seeding scripts
│   └── server.js           # Express app entry point
│
└── frontend/
    ├── src/
    │   ├── components/     # Reusable components
    │   │   ├── Navbar.js
    │   │   ├── SEO.js      # SEO meta tags component
    │   │   └── ui/         # shadcn/ui components
    │   ├── pages/
    │   │   ├── HomePage.js         # Freepik-style homepage
    │   │   ├── ProductDetailPage.js # Enhanced product view
    │   │   ├── PricingPage.js      # Subscription plans
    │   │   ├── UserDashboard.js    # User dashboard
    │   │   └── ...
    │   ├── context/        # React Context
    │   │   ├── AuthContext.js
    │   │   └── CartContext.js
    │   └── App.js
    └── public/

```

## 🔑 Key API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products/special/trending` - Get trending products
- `GET /api/products/special/featured` - Get featured products
- `GET /api/products/special/popular` - Get popular products
- `GET /api/products/search/tags` - Search by tags
- `POST /api/products/:id/view` - Track product view

### Subscriptions

- `GET /api/subscriptions/plans` - Get all plans
- `GET /api/subscriptions/my-subscription` - Get user's subscription
- `POST /api/subscriptions/subscribe` - Subscribe to a plan
- `POST /api/subscriptions/cancel` - Cancel subscription
- `GET /api/subscriptions/history` - Get subscription history

### Downloads

- `GET /api/downloads/:productId/options` - Get download options
- `POST /api/downloads/:productId/download` - Download (with limit check)

### Admin

- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/analytics` - Analytics data
- `GET /api/admin/users` - Get all users
- `PATCH /api/admin/products/:id/premium` - Toggle premium status
- `PATCH /api/admin/products/:id/featured` - Toggle featured status

## 🎯 Usage

### For Users

1. **Browse Assets**: Visit homepage to see trending, featured, and latest assets
2. **Search**: Use the search bar to find specific assets
3. **View Details**: Click on any asset to see full details and preview
4. **Subscribe**: Choose a plan from the Pricing page to get more downloads
5. **Download**: Free users get 3 downloads/month, upgrade for more
6. **Track Usage**: Visit Dashboard to see your downloads and subscription

### For Admins

1. **Login**: Go to `/admin/login` with admin credentials
2. **Upload Assets**: Use the admin panel to upload new products
3. **Manage Content**: Add tags, mark as premium/featured
4. **View Analytics**: Check dashboard for stats and insights
5. **Manage Users**: View and modify user subscriptions

## 🚀 Deployment

### Backend (Render/Railway)

1. Create a new web service
2. Connect your GitHub repository
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)

1. Import your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variables
5. Deploy

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- CORS configuration
- Input validation
- XSS protection

## 📈 Performance Optimizations

- Lazy loading images
- MongoDB indexing on trending/tags
- CDN for asset delivery (R2)
- Pagination for product listings
- Optimized queries with aggregation

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📧 Support

For support, email support@pixeladda.com or join our community.

## 🙏 Acknowledgments

- Design inspiration from Freepik
- UI components from shadcn/ui
- Icons from Lucide React

---

Built with ❤️ by the PixelAdda Team
