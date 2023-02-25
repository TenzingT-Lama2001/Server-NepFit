import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { CustomError } from "../errors/custom.error";
import { errorMsgs, lang } from "../lang";
import { ErrorMsgKey } from "../types";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) {
  // for the  error that we are throwing
  // from services

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      message: errorMsgs.en[err.message as ErrorMsgKey],
    });
  }

  // Check for mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    const firstError = Object.values(err.errors)[0];
    return res.status(400).json({ message: firstError.message });
  }

  console.log(err);

  res.status(500).json({ message: lang.en.INTERNAL_SERVER_ERROR });
}
