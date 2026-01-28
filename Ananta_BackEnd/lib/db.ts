import mongoose from 'mongoose';

// Database Connection
export const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ Database failed:', error);
  }
};

// Admin Model
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'ADMIN' }
}, { timestamps: true });

export const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

// User Model
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  phone: { type: String, required: true },
  isBlocked: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false }
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', userSchema);

// Wallet Model
const walletSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 }
}, { timestamps: true });

export const Wallet = mongoose.models.Wallet || mongoose.model('Wallet', walletSchema);

// DailyRecharge Model
const rechargeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' }
}, { timestamps: true });

export const DailyRecharge = mongoose.models.DailyRecharge || mongoose.model('DailyRecharge', rechargeSchema);

// KYC Model
const kycSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  documentType: { type: String, enum: ['AADHAR', 'PAN', 'PASSPORT'], required: true },
  documentNumber: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' }
}, { timestamps: true });

export const KYC = mongoose.models.KYC || mongoose.model('KYC', kycSchema);