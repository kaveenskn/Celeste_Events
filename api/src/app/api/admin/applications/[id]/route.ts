import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import HotelOwner from '@/models/HotelOwner';
import { getAdminSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const { id } = await params;
  const { action, rejectionReason, tempPassword } = await req.json();

  const owner = await HotelOwner.findById(id);
  if (!owner) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (action === 'approve') {
    const pass = tempPassword || 'Welcome@123';
    const hashed = await bcrypt.hash(pass, 10);
    owner.status = 'approved';
    owner.password = hashed;
    await owner.save();
    return NextResponse.json({ message: 'Approved', tempPassword: pass });
  }

  if (action === 'reject') {
    owner.status = 'rejected';
    owner.rejectionReason = rejectionReason || 'Does not meet our venue requirements.';
    await owner.save();
    return NextResponse.json({ message: 'Rejected' });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const { id } = await params;
  await HotelOwner.findByIdAndDelete(id);
  return NextResponse.json({ message: 'Deleted' });
}
