import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Hotel from '@/models/Hotel';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const hotels = await Hotel.find({}).populate('ownerId', 'fullName email businessName').sort({ createdAt: -1 });
  return NextResponse.json(hotels);
}
