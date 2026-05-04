import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Hotel from '@/models/Hotel';
import HotelOwner from '@/models/HotelOwner';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const owner = await HotelOwner.findById(session.id);
  if (!owner) return NextResponse.json([], { status: 200 });
  const hotels = await Hotel.find({ _id: { $in: owner.hotels } });
  return NextResponse.json(hotels);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const body = await req.json();
  // New hotels start as 'pending' - admin must approve before public sees them
  const hotel = await Hotel.create({ ...body, ownerId: session.id, status: 'pending' });
  await HotelOwner.findByIdAndUpdate(session.id, { $push: { hotels: hotel._id } });
  return NextResponse.json(hotel, { status: 201 });
}
