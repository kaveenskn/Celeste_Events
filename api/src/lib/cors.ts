import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ORIGINS = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  process.env.ADMIN_URL  || 'http://localhost:3002',
  'https://celeste-client.vercel.app',
  'https://celeste-admin.vercel.app',
];

export function corsHeaders(req: NextRequest) {
  const origin = req.headers.get('origin') || '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin':  allowed,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
}

export function handleOptions(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

export function withCors(res: NextResponse, req: NextRequest) {
  const headers = corsHeaders(req);
  Object.entries(headers).forEach(([k, v]) => res.headers.set(k, v));
  return res;
}
