import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import MenuItem from '@/models/MenuItem';

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    await MenuItem.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Menu item deleted' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 });
  }
}
