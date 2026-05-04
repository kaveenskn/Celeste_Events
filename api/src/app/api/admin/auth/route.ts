import { NextRequest, NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@celeste.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    const token = await signToken({ email, role: 'admin' });
    const res = NextResponse.json({ message: 'Admin login successful' });
    res.cookies.set('celeste_admin_token', token, { httpOnly: true, maxAge: 60 * 60 * 8, path: '/' });
    return res;
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
