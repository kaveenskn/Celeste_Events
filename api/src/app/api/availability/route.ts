import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Availability from '@/models/Availability';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const hotelId = searchParams.get('hotelId');
    const year = searchParams.get('year');
    const month = searchParams.get('month');
    if (!hotelId) return NextResponse.json({ error: 'hotelId required' }, { status: 400 });

    let query: Record<string, unknown> = { hotelId };
    if (year && month) {
      const pad = month.padStart(2, '0');
      query.date = { $regex: `^${year}-${pad}` };
    }
    const records = await Availability.find(query);
    return NextResponse.json(records);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { hotelId, date, status } = await req.json();
    const record = await Availability.findOneAndUpdate(
      { hotelId, date },
      { status },
      { upsert: true, new: true }
    );
    return NextResponse.json(record);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
