import mongoose from "mongoose";
export interface IPackage {
  name: string;
  description: string;
  price: number;
  duration: number;
  durationUnit: string;
  stripePackageId: string;
  stripePackagePriceId: string;
}

export interface PackageDocument extends IPackage, mongoose.Document {
  name: string;
  description: string;
  price: number;
  duration: number;
  durationUnit: string;
  stripePackageId: string;
  stripePackagePriceId: string;
}

const PackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide the package name"],
    maxlength: [50, "Name should be under 50 characters"],
  },
  description: {
    type: String,
    required: [true, "Please provide package description"],
    maxlength: [300, "Description should be under 300 characters"],
  },
  price: {
    type: Number,
    required: [true, "Please provide the package price"],
  },
  duration: {
    type: Number,
    required: [true, "Please provide the duration"],
  },
  durationUnit: {
    type: String,
    enum: ["months", "years", "month", "year"],
    required: [true, "Please provide the duration unit"],
  },
  stripePlanId: {
    type: String,
  },
  stripePackageId: {
    type: String,
    // required: [true, "Please provide the Stripe Package ID"],
  },
  stripePackagePriceId: {
    type: String,
    // required: [true, "Please provide the Stripe Price ID"],
  },
});

const Package = mongoose.model<PackageDocument>("Package", PackageSchema);

export default Package;
