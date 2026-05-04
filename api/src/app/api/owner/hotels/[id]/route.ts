import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Hotel from '@/models/Hotel';
import { getSession } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const { id } = await params;
  const body = await req.json();
  const hotel = await Hotel.findOneAndUpdate({ _id: id, ownerId: session.id }, body, { new: true });
  if (!hotel) return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });
  return NextResponse.json(hotel);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const { id } = await params;
  await Hotel.findOneAndDelete({ _id: id, ownerId: session.id });
  return NextResponse.json({ message: 'Deleted' });
}
