import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import HotelOwner from '@/models/HotelOwner';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    const owner = await HotelOwner.findOne({ email });
    if (!owner) return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });

    if (owner.status === 'pending') return NextResponse.json({ error: 'Your application is still under review.' }, { status: 403 });
    if (owner.status === 'rejected') return NextResponse.json({ error: 'Your application was not approved. Please contact support.' }, { status: 403 });

    if (!owner.password) return NextResponse.json({ error: 'Account not set up. Please contact support.' }, { status: 403 });

    const valid = await bcrypt.compare(password, owner.password);
    if (!valid) return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });

    const token = await signToken({ id: owner._id.toString(), email: owner.email, role: 'owner' });

    const res = NextResponse.json({
      message: 'Login successful',
      owner: { id: owner._id, fullName: owner.fullName, email: owner.email, businessName: owner.businessName },
    });
    res.cookies.set('celeste_token', token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: '/' });
    return res;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
