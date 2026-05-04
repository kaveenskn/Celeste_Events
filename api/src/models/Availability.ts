import mongoose, { Schema, Document } from 'mongoose';

export interface IAvailability extends Document {
  hotelId: mongoose.Types.ObjectId;
  date: string; // YYYY-MM-DD
  status: 'available' | 'booked' | 'blocked';
  bookingId?: mongoose.Types.ObjectId;
}

const AvailabilitySchema = new Schema<IAvailability>({
  hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ['available', 'booked', 'blocked'], default: 'available' },
  bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
});

AvailabilitySchema.index({ hotelId: 1, date: 1 }, { unique: true });

export default mongoose.models.Availability ||
  mongoose.model<IAvailability>('Availability', AvailabilitySchema);
