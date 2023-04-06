import { NextFunction, Request, Response } from "express";
import { lang } from "../../lang";
import { productServices } from "../../services/product";
import { createPrice, createProduct } from "../stripe/stripe.controller";

export async function addProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, price, description, quantity, category, unit } = req.body;
    const { image } = req.body;

    const productData = {
      name,
      price,
      description,
      quantity,
      category,
      unit,
    };
    await productServices.addProduct({ productData, image });
    res.status(200).json({
      message: lang.en.CREATED_SUCCESSFULLY,
    });
  } catch (error) {
    next(error);
  }
}
export async function getProducts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { pageNumber, pageSize, searchQuery, sortBy, order } = req.query;
    const data = await productServices.getProducts({
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
export async function getOneProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await productServices.getOneProduct(req.params.productId);

    res.status(200).json({
      message: lang.en.FETCHED_SUCCESSFULLY,
      data,
    });
  } catch (error) {
    next(error);
  }
}
export async function updateProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, price, description, quantity, category, unit } = req.body;
    const { image } = req.body;
    const productData = {
      name,
      price,
      description,
      quantity,
      category,
      unit,
    };
    await productServices.updateProduct({
      productData,
      productId: req.params.productId,
      image,
    });

    res.status(200).json({
      message: lang.en.UPDATED_SUCCESSFULLY,
    });
  } catch (error) {
    next(error);
  }
}
export async function deleteProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await productServices.deleteProduct(req.params.productId);
    res.status(200).json({
      message: lang.en.DELETED_SUCCESSFULLY,
    });
  } catch (error) {
    next(error);
  }
}
