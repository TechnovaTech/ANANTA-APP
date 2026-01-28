import { NextRequest, NextResponse } from 'next/server';
import { connectDB, KYC } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const kycRequests = await KYC.find().sort({ createdAt: -1 });
    return NextResponse.json({ kycRequests });
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
    const { kycId, action } = await request.json();

    const kyc = await KYC.findById(kycId);
    if (!kyc || kyc.status !== 'PENDING') {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }

    if (action === 'approve') {
      await KYC.findByIdAndUpdate(kycId, { status: 'APPROVED' });
      return NextResponse.json({ message: 'KYC approved' });
    } else if (action === 'reject') {
      await KYC.findByIdAndUpdate(kycId, { status: 'REJECTED' });
      return NextResponse.json({ message: 'KYC rejected' });
    }

    return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}