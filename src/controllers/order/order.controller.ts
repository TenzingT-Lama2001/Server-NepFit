import { NextFunction, Request, Response } from "express";
import { lang } from "../../lang";
import { orderServices } from "../../services/order";

export async function createOrder(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await orderServices.createOrder(req.body);
    res.status(200).json({
      message: lang.en.CREATED_SUCCESSFULLY,
    });
    res.status;
  } catch (error) {
    next(error);
  }
}

export async function getOrders(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { pageNumber, pageSize, searchQuery, sortBy, order } = req.query;
    const data = await orderServices.getOrders({
      pageNumber: Number(pageNumber),
      pageSize: Number(pageSize),
      searchQuery: searchQuery as string,
      sortBy: sortBy as string,
      order: order as string,
    });
    res.status(200).json({
      message: lang.en.FETCHED_SUCCESSFULLY,
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function getOneOrder(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await orderServices.getOneOrder(req.params.orderId);
    res.status(200).json({
      message: lang.en.FETCHED_SUCCESSFULLY,
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateOrder(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { ...orderData } = req.body;

    const updatedOrder = await orderServices.updateOrder({
      orderData,
      orderId: req.params.orderId,
    });
    res.status(200).json({
      message: lang.en.UPDATED_SUCCESSFULLY,
      updatedOrder,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteOrder(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await orderServices.deleteOrder(req.params.orderId);
    res.status(200).json({
      message: lang.en.DELETED_SUCCESSFULLY,
    });
  } catch (error) {
    next(error);
  }
}

export async function getOrderByStripeProductId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await orderServices.getOrderByStripeProductId(
      req.params.stripeProductId
    );
    res.status(200).json({
      message: lang.en.FETCHED_SUCCESSFULLY,
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPurchasingHistory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await orderServices.getPurchasingHistory(req.params.memberId);
    res.status(200).json({
      message: lang.en.FETCHED_SUCCESSFULLY,
      data,
    });
    console.log({ data });
  } catch (error) {
    next(error);
  }
}
