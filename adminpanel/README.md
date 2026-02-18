# 🚀 ANANTA Admin Panel (Next.js)

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Create admin user
npm run seed

# Start the app
npm run dev
```

## 🔐 Login
- **URL:** http://localhost:3000
- **Email:** admin@ananta.com
- **Password:** Admin@123

## 📁 Perfect Next.js Structure
```
├── app/
│   ├── api/admin/          # API Routes
│   │   ├── login/route.ts
│   │   ├── users/route.ts
│   │   ├── recharges/route.ts
│   │   └── kyc/route.ts
│   ├── login/page.tsx      # Login Page
│   ├── users/page.tsx      # Users Management
│   ├── recharges/page.tsx  # Recharge Approval
│   ├── kyc/page.tsx        # KYC Verification
│   ├── layout.tsx          # Main Layout
│   └── page.tsx            # Home Page
├── lib/
│   ├── db.ts              # Database & Models
│   ├── auth.ts            # Authentication
│   └── seed.js            # Create Admin
├── .env                   # Environment Variables
└── package.json
```

## ✅ Features
- 🔐 JWT Authentication
- 👥 User Management (Block/Ban)
- 💰 Recharge Approval System
- 📋 KYC Verification
- 🎨 Beautiful UI with Emojis
- 📱 Responsive Design

## 🛠 Tech Stack
- **Frontend:** Next.js 14 + React + TypeScript
- **Backend:** Next.js API Routes
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcrypt

**Everything in one Next.js app - Perfect structure!** 🎯