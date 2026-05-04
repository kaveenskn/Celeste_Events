import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ message: 'Logged out' });
  res.cookies.set('celeste_token', '', { maxAge: 0, path: '/' });
  res.cookies.set('celeste_admin_token', '', { maxAge: 0, path: '/' });
  return res;
}
