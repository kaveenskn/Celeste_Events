import mongoose, { Schema, Document } from 'mongoose';

export interface IMenuItem extends Document {
  hotelId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  pricePerPlate: number;
  category: 'appetizer' | 'main' | 'dessert' | 'beverage';
  image?: string;
}

const MenuItemSchema = new Schema<IMenuItem>({
  hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  pricePerPlate: { type: Number, required: true },
  category: {
    type: String,
    enum: ['appetizer', 'main', 'dessert', 'beverage'],
    required: true,
  },
  image: { type: String },
});

export default mongoose.models.MenuItem || mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);
