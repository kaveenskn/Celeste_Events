import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import MenuItem from '@/models/MenuItem';
import Hotel from '@/models/Hotel';
import HotelOwner from '@/models/HotelOwner';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const { searchParams } = new URL(req.url);
  const hotelId = searchParams.get('hotelId');
  const owner = await HotelOwner.findById(session.id);
  if (!owner) return NextResponse.json([], { status: 200 });
  const hotelIds = hotelId ? [hotelId] : owner.hotels.map((h: unknown) => h?.toString());
  const items = await MenuItem.find({ hotelId: { $in: hotelIds } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const body = await req.json();
  // verify hotel belongs to owner
  const hotel = await Hotel.findOne({ _id: body.hotelId, ownerId: session.id });
  if (!hotel) return NextResponse.json({ error: 'Hotel not found or unauthorized' }, { status: 403 });
  const item = await MenuItem.create(body);
  return NextResponse.json(item, { status: 201 });
}
