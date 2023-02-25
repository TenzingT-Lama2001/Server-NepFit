import mongoose from "mongoose";
import validator from "validator";

export interface IBase {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface BaseDocument extends IBase, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const baseOption = {
  discriminatorKey: "user",
  collection: "user",
  timestamps: true,
};

export const BaseSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide your first name"],
      maxlength: [10, "Name should be under 10 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Please provide your last name"],
      maxlength: [10, "Name should be under 10 characters"],
    },
    password: {
      type: String,
      required: [true, "Please provide a Password"],
      minlength: [6, "Password must be atleast 6 characters"],
      select: false,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      validate: [validator.isEmail, "Please enter email in correct format"],
      unique: true,
    },
  },
  baseOption
);

export default mongoose.model<BaseDocument>("BaseSchema", BaseSchema);
