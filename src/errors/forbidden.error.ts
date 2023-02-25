import { ErrorMsgKey } from "../types";
import { CustomError } from "./custom.error";

export class ForbiddenError extends CustomError {
  statusCode = 403;

  constructor(public message: ErrorMsgKey) {
    super(message);

    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}
