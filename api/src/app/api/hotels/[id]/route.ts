import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Hotel from '@/models/Hotel';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const hotel = await Hotel.findById(id);
    if (!hotel) return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
    return NextResponse.json(hotel);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch hotel' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const hotel = await Hotel.findByIdAndUpdate(id, body, { new: true });
    if (!hotel) return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
    return NextResponse.json(hotel);
  } catch {
    return NextResponse.json({ error: 'Failed to update hotel' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    await Hotel.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Hotel deleted' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete hotel' }, { status: 500 });
  }
}
