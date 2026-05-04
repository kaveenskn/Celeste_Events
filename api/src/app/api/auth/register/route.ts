import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import HotelOwner from '@/models/HotelOwner';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { fullName, email, phone, businessName, businessAddress,
            businessRegNumber, website, description } = body;

    if (!fullName || !email || !phone || !businessName || !businessAddress || !businessRegNumber || !description) {
      return NextResponse.json({ error: 'All required fields must be filled.' }, { status: 400 });
    }

    const existing = await HotelOwner.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: 'An application with this email already exists.' }, { status: 409 });
    }

    const owner = await HotelOwner.create({
      fullName, email, phone, businessName,
      businessAddress, businessRegNumber,
      website: website || '',
      description,
      status: 'pending',
    });

    return NextResponse.json({ message: 'Application submitted successfully.', id: owner._id }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
