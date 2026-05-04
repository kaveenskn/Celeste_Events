import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import HotelOwner from '@/models/HotelOwner';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const apps = await HotelOwner.find({}).select('-password').sort({ createdAt: -1 });
  return NextResponse.json(apps);
}
