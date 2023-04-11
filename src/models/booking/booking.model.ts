import mongoose, { Schema } from "mongoose";

export interface IBooking {
  member: string;
  trainer: string;
  startDate: Date;
  endDate: Date;
  address: string;
  status: "declined" | "approved" | "pending";
}

export interface BookingDocument extends IBooking, mongoose.Document {
  member: string;
  trainer: string;
  startDate: Date;
  endDate: Date;
  address: string;
  status: "declined" | "approved" | "pending";
}

const BookingSchema = new mongoose.Schema({
  member: {
    type: Schema.Types.ObjectId,
    ref: "Member",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  trainer: {
    type: Schema.Types.ObjectId,
    ref: "Trainer",
    required: true,
  },
  address: String,
  status: {
    type: String,
    required: true,
    enum: ["approved", "pending", "declined"],
    default: "pending",
  },
});

const Booking = mongoose.model<BookingDocument>("Booking", BookingSchema);

export default Booking;
