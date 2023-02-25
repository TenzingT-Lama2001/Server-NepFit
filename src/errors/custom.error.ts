import { ErrorMsgKey } from "../types";

export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: ErrorMsgKey) {
    super(message as string);

    //When you create an object using the new keyword,
    //JavaScript automatically sets the object's prototype to be the prototype of the constructor function that you used.
    //In this case. the 'CustomError' class is defined as an abstract class ,it cannot be instantiated using new keyword
    //so explicitly setting the prototype of the object ot be 'CustomError.prototype
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

//In JavaScript, objects have a prototype which is used to implement inheritance. The prototype is an object that is used as a fallback source of properties for an object. When you access a property on an object, JavaScript first looks for the property on the object itself. If it doesn't find it, it looks for the property on the object's prototype. If it doesn't find it there, it looks for the property on the prototype's prototype, and so on.
