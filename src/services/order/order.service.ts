import { SortOrder } from "mongoose";
import Order from "../../models/order/order.model";
import { OrderDocument } from "../../models/order/order.model";

export interface CreateOrder {
  memberId: string;
  shippingAddress: string;
  deliveryStatus: "delivered" | "pending";
  productId: string[];
  amount: number;
}
export async function createOrder({
  memberId,
  shippingAddress,
  deliveryStatus,
  productId,
  amount,
}: CreateOrder) {
  await Order.create({
    memberId,
    shippingAddress,
    deliveryStatus,
    productId,
    amount,
  });
}

export type GetOrders = {
  pageNumber: number;
  pageSize: number;
  searchQuery: string;
  sortBy: string;
  order: string;
};
export async function getOrders({
  pageNumber,
  pageSize,
  searchQuery,
  sortBy,
  order,
}: GetOrders) {
  const regex = new RegExp(searchQuery, "i");
  const pageNumberPositive = Math.max(pageNumber + 1, 1);
  const query = Order.find({
    $or: [{ memberId: regex }, { productId: regex }],
  })
    .skip((pageNumberPositive - 1) * pageSize)
    .limit(pageSize);

  if (sortBy) {
    const sort: { [key: string]: SortOrder } = {};
    sort[sortBy] = order === "asc" ? 1 : -1;
    query.sort(sort);
  }
  const orders = await query;
  const totalOrders = await Order.countDocuments({
    $or: [{ memberId: regex }, { productId: regex }],
  });
  return {
    orders,
    totalOrders,
  };
}
export async function getOneOrder(id: string) {
  const order = await Order.findById(id);
  return order;
}

type UpdateOrder = {
  orderData: Partial<OrderDocument>;
  orderId: string;
};
export async function updateOrder({ orderData, orderId }: UpdateOrder) {
  await Order.findByIdAndUpdate(orderId, orderData, {
    new: true,
    runValidators: true,
  });
}
export async function deleteOrder(orderId: string) {
  await Order.findByIdAndDelete(orderId);
}
