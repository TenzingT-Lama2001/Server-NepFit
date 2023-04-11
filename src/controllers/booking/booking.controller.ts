import { NextFunction, Request, Response } from "express";
import { lang } from "../../lang";
import { bookingServices } from "../../services/booking";
import { createNoSubstitutionTemplateLiteral } from "typescript";

export async function createBooking(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await bookingServices.createBooking(req.body);
    res.status(200).json({
      message: lang.en.CREATED_SUCCESSFULLY,
    });
    res.status;
  } catch (error) {
    next(error);
  }
}

export async function getBookings(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { pageNumber, pageSize, searchQuery, sortBy, order } = req.query;
    const data = await bookingServices.getBookings({
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

export async function getOneBooking(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await bookingServices.getOneBooking(req.params.bookingId);
    res.status(200).json({
      message: lang.en.FETCHED_SUCCESSFULLY,
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteBooking(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await bookingServices.deleteBooking(req.params.bookingId);
    res.status(200).json({
      message: lang.en.DELETED_SUCCESSFULLY,
    });
  } catch (error) {
    next(error);
  }
}
export async function updateBooking(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log(req.body);
    const updatedBooking = await bookingServices.updateBooking(req.body);
    res.status(200).json({
      message: lang.en.UPDATED_SUCCESSFULLY,
      updatedBooking,
    });
  } catch (error) {
    next(error);
  }
}
export async function getApprovedBookings(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log(req.query.id);
    const data = await bookingServices.getApprovedBookings(req.query.id);
    res.status(200).json({
      message: lang.en.FETCHED_SUCCESSFULLY,
      data,
    });
  } catch (error) {
    next(error);
  }
}
