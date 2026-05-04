import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'celeste-events-secret-2024-change-in-production'
);

export async function signToken(payload: Record<string, unknown>) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('celeste_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('celeste_admin_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}
