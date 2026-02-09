# Digital Design Marketplace

A full-stack e-commerce platform for selling digital design files (PSD, AI, CDR, ZIP) built with Node.js, Express, React, and MongoDB.

## 🚀 Features

### Customer Features
- Browse digital design products by category
- View detailed product information with preview images
- Secure payment processing via Razorpay
- User authentication (register/login)
- Personal dashboard with purchased products
- Secure file downloads with time-limited signed URLs

### Admin Features
- Secure admin authentication
- Dashboard with sales analytics
- Category management (create, edit, delete)
- Product management (upload files, set pricing, manage inventory)
- Order tracking and customer management
- File storage via Cloudflare R2 (S3-compatible)

## 🛠 Tech Stack

**Frontend:**
- React.js with React Router
- Tailwind CSS for styling
- Shadcn UI components
- Axios for API calls
- Sonner for toast notifications

**Backend:**
- Node.js + Express.js
- MongoDB with Mongoose ODM
- JWT authentication
- Bcrypt for password hashing
- Multer for file uploads
- AWS SDK for Cloudflare R2 integration

**Payment:**
- Razorpay payment gateway

**Storage:**
- Cloudflare R2 (S3-compatible) for design files
- MongoDB for metadata

## 📦 Installation

### Prerequisites
- Node.js v20+
- MongoDB
- Yarn package manager

### Backend Setup

1. Navigate to backend directory:
```bash
cd /app/backend
```

2. Install dependencies:
```bash
yarn install
```

3. Configure environment variables in `.env`:
```
MONGO_URL="mongodb://localhost:27017"
DB_NAME="design_marketplace"
CORS_ORIGINS="*"
JWT_SECRET="your-secret-key"
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-secret"
RAZORPAY_WEBHOOK_SECRET="your-webhook-secret"
R2_ENDPOINT="https://your-account-id.r2.cloudflarestorage.com"
R2_ACCESS_KEY_ID="your-r2-access-key"
R2_SECRET_ACCESS_KEY="your-r2-secret"
R2_BUCKET_NAME="your-bucket-name"
```

4. Seed admin user:
```bash
node scripts/seedAdmin.js
```

5. Start the server:
```bash
node server.js
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd /app/frontend
```

2. Install dependencies:
```bash
yarn install
```

3. Start the development server:
```bash
yarn start
```

## 🔑 Default Admin Credentials

- **Email:** admin@example.com
- **Password:** Admin@123

⚠️ **Important:** Change these credentials after first login!

## 🔐 Required Credentials

### 1. Razorpay Setup
1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Get your API keys from Settings → API Keys
3. Add keys to `/app/backend/.env`:
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `RAZORPAY_WEBHOOK_SECRET`

### 2. Cloudflare R2 Setup
1. Create a Cloudflare account
2. Navigate to R2 Object Storage
3. Create a new bucket
4. Generate API tokens with read/write permissions
5. Add credentials to `/app/backend/.env`:
   - `R2_ENDPOINT` (format: https://[account-id].r2.cloudflarestorage.com)
   - `R2_ACCESS_KEY_ID`
   - `R2_SECRET_ACCESS_KEY`
   - `R2_BUCKET_NAME`

## 📁 Project Structure

```
/app
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── utils/           # Utility functions (R2 storage)
│   ├── scripts/         # Database seed scripts
│   ├── server.js        # Express server
│   └── .env            # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # Auth context
│   │   ├── App.js
│   │   └── index.js
│   └── public/
└── README.md
```

## 🎨 Design Guidelines

The application follows "The Swiss Archive" design system:
- Clean, minimalist white/black aesthetic
- Vibrant blue accent color (#0055FF)
- Outfit font for headings
- DM Sans for body text
- Professional, gallery-like product display

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `GET /api/products/:id/download` - Get secure download URL

### Orders
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders` - Get all orders (Admin)
- `GET /api/orders/:id` - Get single order

### Payment
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify-payment` - Verify payment
- `POST /api/payment/webhook` - Razorpay webhook

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/products` - Get all products with details

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (Admin/Customer)
- Secure file downloads with time-limited signed URLs
- Payment verification via Razorpay signatures
- Protected API endpoints
- CORS configuration

## 💳 Payment Flow

1. Customer adds product to cart and initiates checkout
2. Backend creates Razorpay order
3. Frontend displays Razorpay payment modal
4. Customer completes payment
5. Razorpay sends payment confirmation
6. Backend verifies payment signature
7. Product added to user's purchased items
8. User can download from dashboard

## 📦 File Storage Architecture

- **Preview Images:** Stored in R2 under `previews/` folder
- **Product Files:** Stored in R2 under `products/` folder
- **Metadata:** Stored in MongoDB (file keys, names, sizes)
- **Downloads:** Generated as time-limited signed URLs (1 hour expiry)

## 🚀 Deployment Notes

- Backend runs on port 8001
- Frontend runs on port 3000
- All API routes prefixed with `/api`
- MongoDB connection via environment variable
- Hot reload enabled for development

## 📝 Next Steps

1. **Add Razorpay Credentials** - Get test keys from Razorpay dashboard
2. **Set up Cloudflare R2** - Create bucket and add credentials
3. **Create Categories** - Login as admin and create product categories
4. **Upload Products** - Add your first design products with preview images
5. **Test Purchase Flow** - Complete an end-to-end test purchase

## 🐛 Troubleshooting

### Backend not starting
- Check MongoDB is running
- Verify all environment variables in `.env`
- Check logs: `tail -f /var/log/supervisor/backend.err.log`

### File upload fails
- Verify Cloudflare R2 credentials are correct
- Check R2 bucket permissions
- Ensure bucket name matches `.env` configuration

### Payment fails
- Verify Razorpay keys are correct
- Check Razorpay dashboard for test mode
- Ensure webhook is configured correctly

## 📄 License

This project is built for a solo graphic designer marketplace.
