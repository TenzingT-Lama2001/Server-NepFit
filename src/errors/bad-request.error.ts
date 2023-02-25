import { ErrorMsgKey } from "../types";
import { CustomError } from "./custom.error";

export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(public message: ErrorMsgKey) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}
