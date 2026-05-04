import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  hotelId: mongoose.Types.ObjectId;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  eventDate: Date;
  guestCount: number;
  selectedMenuItems: Array<{
    menuItemId: mongoose.Types.ObjectId;
    name: string;
    pricePerPlate: number;
  }>;
  basePrice: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  specialRequests?: string;
  createdAt: Date;
}

const BookingSchema = new Schema<IBooking>({
  hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
  guestName: { type: String, required: true },
  guestEmail: { type: String, required: true },
  guestPhone: { type: String, required: true },
  eventDate: { type: Date, required: true },
  guestCount: { type: Number, required: true },
  selectedMenuItems: [
    {
      menuItemId: { type: Schema.Types.ObjectId, ref: 'MenuItem' },
      name: { type: String, required: true },
      pricePerPlate: { type: Number, required: true },
    },
  ],
  basePrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'confirmed' },
  specialRequests: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
