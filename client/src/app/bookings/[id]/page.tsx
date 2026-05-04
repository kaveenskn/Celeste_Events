import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Calendar, Users, MapPin, ChefHat, Phone, Mail, ArrowLeft } from 'lucide-react';

async function getBooking(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/bookings/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export default async function BookingConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = await getBooking(id);
  if (!booking) notFound();

  const hotel = booking.hotelId;
  const eventDate = new Date(booking.eventDate).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      {/* Success Header */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-amber-500/10 border-2 border-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-amber-400" />
        </div>
        <p className="text-amber-500 text-xs font-bold tracking-widest mb-2">BOOKING CONFIRMED</p>
        <h1 className="font-serif text-4xl text-amber-50 mb-3">Your Event is Booked!</h1>
        <p className="text-stone-400">Confirmation #{id.slice(-8).toUpperCase()}</p>
        <p className="text-stone-500 text-sm mt-2">Our team will contact you at {booking.guestEmail} within 24 hours.</p>
      </div>

      {/* Booking Card */}
      <div className="bg-stone-900 border border-amber-800/30 rounded-sm overflow-hidden">
        {/* Hotel Image */}
        {hotel?.images?.[0] && (
          <div className="h-40 overflow-hidden">
            <img src={hotel.images[0]} alt={hotel.name} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Venue */}
          <div>
            <p className="text-amber-500 text-xs font-bold tracking-widest mb-2">VENUE</p>
            <h2 className="font-serif text-2xl text-amber-50">{hotel?.name || 'Hotel'}</h2>
            <p className="text-stone-500 text-sm flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5" /> {hotel?.location}
            </p>
          </div>

          <div className="h-px bg-stone-800" />

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-stone-600 text-xs tracking-widest mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> EVENT DATE
              </p>
              <p className="text-stone-200 text-sm font-medium">{eventDate}</p>
            </div>
            <div>
              <p className="text-stone-600 text-xs tracking-widest mb-1 flex items-center gap-1">
                <Users className="w-3 h-3" /> GUESTS
              </p>
              <p className="text-stone-200 text-sm font-medium">{booking.guestCount} people</p>
            </div>
            <div>
              <p className="text-stone-600 text-xs tracking-widest mb-1 flex items-center gap-1">
                <Mail className="w-3 h-3" /> EMAIL
              </p>
              <p className="text-stone-200 text-sm font-medium">{booking.guestEmail}</p>
            </div>
            <div>
              <p className="text-stone-600 text-xs tracking-widest mb-1 flex items-center gap-1">
                <Phone className="w-3 h-3" /> PHONE
              </p>
              <p className="text-stone-200 text-sm font-medium">{booking.guestPhone}</p>
            </div>
          </div>

          <div className="h-px bg-stone-800" />

          {/* Menu */}
          {booking.selectedMenuItems?.length > 0 && (
            <div>
              <p className="text-amber-500 text-xs font-bold tracking-widest mb-3 flex items-center gap-1">
                <ChefHat className="w-3.5 h-3.5" /> SELECTED MENU
              </p>
              <div className="space-y-2">
                {booking.selectedMenuItems.map((item: { menuItemId: string; name: string; pricePerPlate: number }, i: number) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-stone-300">{item.name}</span>
                    <span className="text-stone-400">${item.pricePerPlate}/plate × {booking.guestCount} = <span className="text-stone-300">${(item.pricePerPlate * booking.guestCount).toLocaleString()}</span></span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="h-px bg-stone-800" />

          {/* Price Breakdown */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-stone-400">
              <span>Venue rental</span>
              <span>${booking.basePrice.toLocaleString()}</span>
            </div>
            {booking.selectedMenuItems?.length > 0 && (
              <div className="flex justify-between text-sm text-stone-400">
                <span>Menu total</span>
                <span>${(booking.totalPrice - booking.basePrice).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-stone-800">
              <span className="text-amber-100">Total</span>
              <span className="text-amber-400">${booking.totalPrice.toLocaleString()}</span>
            </div>
          </div>

          {booking.specialRequests && (
            <div className="bg-stone-800/50 rounded-sm p-4">
              <p className="text-stone-600 text-xs tracking-widest mb-1">SPECIAL REQUESTS</p>
              <p className="text-stone-300 text-sm">{booking.specialRequests}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-stone-400 hover:text-amber-400 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Browse More Venues
        </Link>
      </div>
    </div>
  );
}
