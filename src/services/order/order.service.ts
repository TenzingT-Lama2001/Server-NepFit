import { SortOrder } from "mongoose";
import Order from "../../models/order/order.model";
import { OrderDocument } from "../../models/order/order.model";
import Product from "../../models/product/product.model";
import { P } from "pino";

export interface CreateOrder {
  memberId: string;
  shippingAddress: string;
  deliveryStatus: "delivered" | "pending";
  products: [
    {
      stripeProductId: string;
      qty: number;
      name: string;
      amount: number;
    }
  ];
  amount: number;
}
export async function createOrder({
  memberId,
  shippingAddress,
  deliveryStatus,
  products,
  amount,
}: CreateOrder) {
  await Order.create({
    memberId,
    shippingAddress,
    deliveryStatus,
    products,
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
  const query = Order.find({})
    .skip((pageNumberPositive - 1) * pageSize)
    .limit(pageSize);

  if (sortBy) {
    const sort: { [key: string]: SortOrder } = {};
    sort[sortBy] = order === "asc" ? 1 : -1;
    query.sort(sort);
  }
  const orders = await query;
  const totalOrders = await Order.countDocuments({});
  console.log({ orders });
  const stripeProductsId = await orders.map(
    (order: any) => order.products.stripeProductId
  );

  console.log({ stripeProductsId });
  const stripeProductQty = orders.map((order: any) => order.products.qty);
  console.log({ stripeProductQty });
  // Fetch products by productId using Promise.all()
  const productQueries = stripeProductsId?.map((stripeProductsId: string) => {
    return Product.findOne({ stripeProductsId }).exec();
  });

  const productsData = await Promise.all(productQueries);
  console.log({ productsData });
  // Combine product and quantity data into a single array
  const combinedData = productsData.map((product: any, index: number) => {
    return {
      productId: stripeProductsId[index],
      qty: stripeProductQty[index],
      productName: product?.name,
    };
  });
  console.log({ combinedData });
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
  const updatedOrder = await Order.findByIdAndUpdate(orderId, orderData, {
    new: true,
    runValidators: true,
  });
  return updatedOrder;
}
export async function deleteOrder(orderId: string) {
  await Order.findByIdAndDelete(orderId);
}

export async function getOrderByStripeProductId(stripeProductId: string) {
  const order = await Order.find({ stripeProductId });
  return order;
}

export async function getPurchasingHistory(memberId: string) {
  console.log({ memberId });
  const purchasingHistory = await Order.find({
    memberId,
    // deliveryStatus: "delivered",
  });
  console.log({ purchasingHistory });

  return purchasingHistory;
}
