import { ErrorMsgKey } from "../types";
import { CustomError } from "./custom.error";

export class NoContentError extends CustomError {
  statusCode = 204;

  constructor(public message: ErrorMsgKey) {
    super(message);

    Object.setPrototypeOf(this, NoContentError.prototype);
  }
}
