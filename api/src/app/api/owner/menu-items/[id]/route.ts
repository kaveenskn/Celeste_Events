import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import MenuItem from '@/models/MenuItem';
import Hotel from '@/models/Hotel';
import { getSession } from '@/lib/auth';

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const { id } = await params;
  const item = await MenuItem.findById(id).populate('hotelId');
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const hotel = await Hotel.findOne({ _id: item.hotelId, ownerId: session.id });
  if (!hotel) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  await MenuItem.findByIdAndDelete(id);
  return NextResponse.json({ message: 'Deleted' });
}
