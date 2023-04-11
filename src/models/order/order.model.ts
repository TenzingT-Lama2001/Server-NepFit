import mongoose, { Schema } from "mongoose";
export interface IOrder {
  memberId: string;
  shippingAddress: string;
  deliveryStatus: "delivered" | "pending";
  products: [
    {
      stripeProductId: string;
      qty: number;
    }
  ];
  amount: number;
}

export interface OrderDocument extends IOrder, mongoose.Document {
  memberId: string;
  shippingAddress: string;
  deliveryStatus: "delivered" | "pending";
  products: [
    {
      stripeProductId: string;
      qty: number;
    }
  ];
  amount: number;
}

const OrderSchema = new mongoose.Schema({
  memberId: {
    type: String,
    required: true,
  },
  purchasedDate: {
    type: Date,
    default: Date.now(),
  },
  shippingAddress: String,
  deliveryStatus: {
    type: String,
    required: true,
    enum: ["delivered", "pending"],
    default: "pending",
  },
  products: [
    {
      stripeProductId: {
        type: String,
        required: true,
      },
      qty: {
        type: Number,
        required: true,
        min: 1,
      },
      name: String,
      amount: Number,
    },
  ],
  amount: Number,
});

const Order = mongoose.model<OrderDocument>("Order", OrderSchema);

export default Order;
