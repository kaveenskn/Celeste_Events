import mongoose, { Schema, Document } from 'mongoose';

export interface IHotelOwner extends Document {
  _id: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  password: string;
  phone: string;
  businessName: string;
  businessAddress: string;
  businessRegNumber: string;
  website?: string;
  description: string;
  documents: string[]; // URLs
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  hotels: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const HotelOwnerSchema = new Schema<IHotelOwner>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, default: '' },
  phone: { type: String, required: true },
  businessName: { type: String, required: true },
  businessAddress: { type: String, required: true },
  businessRegNumber: { type: String, required: true },
  website: { type: String },
  description: { type: String, required: true },
  documents: [{ type: String }],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  rejectionReason: { type: String },
  hotels: [{ type: Schema.Types.ObjectId, ref: 'Hotel' }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.HotelOwner ||
  mongoose.model<IHotelOwner>('HotelOwner', HotelOwnerSchema);
