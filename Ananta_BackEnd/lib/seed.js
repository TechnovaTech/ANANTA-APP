const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Environment variables
const MONGODB_URI = 'mongodb://localhost:27017/ananta';
const SUPER_ADMIN_EMAIL = 'admin@ananta.com';
const SUPER_ADMIN_PASSWORD = 'Admin@123';

// Admin Schema
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'SUPER_ADMIN' }
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);

// Seed function
const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected');

    const existingAdmin = await Admin.findOne({ email: SUPER_ADMIN_EMAIL });
    if (existingAdmin) {
      console.log('✅ Admin already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 10);
    await Admin.create({
      email: SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      role: 'SUPER_ADMIN'
    });

    console.log('✅ Super admin created successfully!');
    console.log('📧 Email:', SUPER_ADMIN_EMAIL);
    console.log('🔑 Password:', SUPER_ADMIN_PASSWORD);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedAdmin();