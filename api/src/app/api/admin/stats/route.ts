import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const [Hotel, HotelOwner, Booking] = await Promise.all([
    import('@/models/Hotel').then(m => m.default),
    import('@/models/HotelOwner').then(m => m.default),
    import('@/models/Booking').then(m => m.default),
  ]);
  const [totalHotels, pendingHotels, approvedHotels, totalOwners, pendingOwners, totalBookings, bookings] = await Promise.all([
    Hotel.countDocuments(),
    Hotel.countDocuments({ status: 'pending' }),
    Hotel.countDocuments({ status: 'approved' }),
    HotelOwner.countDocuments(),
    HotelOwner.countDocuments({ status: 'pending' }),
    Booking.countDocuments(),
    Booking.find({}).select('totalPrice'),
  ]);
  const revenue = bookings.reduce((s: number, b: { totalPrice: number }) => s + b.totalPrice, 0);
  return NextResponse.json({ totalHotels, pendingHotels, approvedHotels, totalOwners, pendingOwners, totalBookings, revenue });
}
