import mongoose, { Schema } from "mongoose";
export interface IOrder {
  memberId: string;
  shippingAddress: string;
  deliveryStatus: "delivered" | "pending";
  productId: string[];
  amount: number;
}

export interface OrderDocument extends IOrder, mongoose.Document {
  memberId: string;
  shippingAddress: string;
  deliveryStatus: "delivered" | "pending";
  productId: string[];
  amount: number;
}

const OrderSchema = new mongoose.Schema({
  memberId: {
    type: Schema.Types.ObjectId,
    ref: "Member",
    required: true,
  },
  shippingAddress: String,
  deliveryStatus: {
    type: String,
    required: true,
    enum: ["delivered", "pending"],
    default: "pending",
  },
  productId: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  ],
  amount: Number,
});

const Order = mongoose.model<OrderDocument>("Order", OrderSchema);

export default Order;
