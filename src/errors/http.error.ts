import { ErrorMsgKey } from "../types";
import { CustomError } from "./custom.error";

export class HttpError extends CustomError {
  constructor(public statusCode: number, public message: ErrorMsgKey) {
    super(message);

    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
