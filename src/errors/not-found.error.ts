import { CustomError } from "./custom.error";

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super("NOT_FOUND");

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
