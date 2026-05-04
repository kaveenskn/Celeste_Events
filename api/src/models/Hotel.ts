import mongoose, { Schema, Document } from 'mongoose';

export interface IHotel extends Document {
  name: string;
  location: string;
  description: string;
  basePrice: number;
  capacity: number;
  images: string[];
  image360?: string;
  amenities: string[];
  ownerId?: mongoose.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  rejectionNote?: string;
  rating?: number;
  reviewCount?: number;
  featured?: boolean;
  createdAt: Date;
}

const HotelSchema = new Schema<IHotel>({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  basePrice: { type: Number, required: true },
  capacity: { type: Number, required: true },
  images: [{ type: String }],
  image360: { type: String },
  amenities: [{ type: String }],
  ownerId: { type: Schema.Types.ObjectId, ref: 'HotelOwner' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  rejectionNote: { type: String },
  rating: { type: Number, default: 4.5 },
  reviewCount: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Hotel || mongoose.model<IHotel>('Hotel', HotelSchema);
