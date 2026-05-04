import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import HotelOwner from '@/models/HotelOwner';
import bcrypt from 'bcryptjs';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const owner = await HotelOwner.findById(session.id).select('-password').populate('hotels');
  return NextResponse.json(owner);
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const { fullName, phone, website, description, newPassword } = await req.json();
  const update: Record<string, string> = { fullName, phone, website, description };
  if (newPassword) update.password = await bcrypt.hash(newPassword, 10);
  const owner = await HotelOwner.findByIdAndUpdate(session.id, update, { new: true }).select('-password');
  return NextResponse.json(owner);
}
