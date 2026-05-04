import { NextRequest, NextResponse } from 'next/server';

async function tryConnect() {
  const { default: connectDB } = await import('@/lib/mongodb');
  await connectDB();
}

// PUBLIC - only approved hotels visible to users
export async function GET(req: NextRequest) {
  try {
    await tryConnect();
    const { default: Hotel } = await import('@/models/Hotel');
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get('featured');
    const query: Record<string, unknown> = { status: 'approved' };
    if (featured === 'true') query.featured = true;
    const hotels = await Hotel.find(query).sort({ createdAt: -1 });
    return NextResponse.json(hotels);
  } catch {
    return NextResponse.json({ error: 'Database not connected' }, { status: 500 });
  }
}
