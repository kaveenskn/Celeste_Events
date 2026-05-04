import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import HotelOwner from '@/models/HotelOwner';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const owner = await HotelOwner.findById(session.id);
  if (!owner) return NextResponse.json([], { status: 200 });
  const bookings = await Booking.find({ hotelId: { $in: owner.hotels } })
    .populate('hotelId', 'name location')
    .sort({ createdAt: -1 });
  return NextResponse.json(bookings);
}
