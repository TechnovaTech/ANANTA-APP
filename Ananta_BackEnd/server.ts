import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import adminRoutes from './routes/admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'ANANTA Backend Running!' });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server: http://localhost:${PORT}`);
      console.log(`✅ Admin: http://localhost:3000`);
    });
  } catch (error) {
    console.error('❌ Server failed:', error);
  }
};

startServer();