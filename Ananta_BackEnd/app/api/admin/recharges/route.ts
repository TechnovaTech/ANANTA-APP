import { NextRequest, NextResponse } from 'next/server';
import { connectDB, DailyRecharge, Wallet } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const recharges = await DailyRecharge.find().sort({ createdAt: -1 });
    return NextResponse.json({ recharges });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { rechargeId, action } = await request.json();

    const recharge = await DailyRecharge.findById(rechargeId);
    if (!recharge || recharge.status !== 'PENDING') {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }

    if (action === 'approve') {
      await DailyRecharge.findByIdAndUpdate(rechargeId, { status: 'APPROVED' });
      await Wallet.findOneAndUpdate(
        { userId: recharge.userId },
        { $inc: { balance: recharge.amount } },
        { upsert: true }
      );
      return NextResponse.json({ message: 'Recharge approved' });
    } else if (action === 'reject') {
      await DailyRecharge.findByIdAndUpdate(rechargeId, { status: 'REJECTED' });
      return NextResponse.json({ message: 'Recharge rejected' });
    }

    return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}