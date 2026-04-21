import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  clientName: string;
  clientEmail: string;
  date: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  amount: number;
  createdAt: Date;
}

const BookingSchema: Schema = new Schema(
  {
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    date: { type: String, required: true },
    status: {
      type: String,
      enum: ['Confirmed', 'Pending', 'Cancelled'],
      default: 'Pending'
    },
    amount: { type: Number, required: true }
  },
  { timestamps: true } // 🔥 IMPORTANT
);

export default mongoose.model<IBooking>('Booking', BookingSchema);