import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import HotelOwner from '@/models/HotelOwner';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    await connectDB();
    const owner = await HotelOwner.findById(session.id).select('-password').populate('hotels');
    if (!owner) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json(owner);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
