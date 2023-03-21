import { SortOrder } from "mongoose";
import config from "../../config/default";
import Package, { PackageDocument } from "../../models/package/package.model";
import Stripe from "stripe";
import {
  createPrice,
  createProduct,
} from "../../controllers/stripe/stripe.controller";

const stripe = new Stripe(config.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

type CreatePackage = {
  packageData: Partial<PackageDocument>;
};
export async function addPackage({ packageData }: CreatePackage) {
  const { name, description, price, duration, durationUnit } = packageData;
  const currency = "usd";
  const metadata = {
    price,
    currency,
  };
  const product = await createProduct(name, description, metadata);
  console.log(product);

  const productId = product.id;
  console.log(productId);

  let interval_count: number;
  duration > 1 ? (interval_count = duration) : (interval_count = 1);
  const priceObject = await createPrice(
    price,
    currency,
    productId,
    interval_count
  );

  const newData = {
    name,
    description,
    price,
    duration,
    durationUnit,
    stripePackageId: productId,
    stripePackagePriceId: priceObject.id,
  };

  return await Package.create(newData);
}
export type GetPackages = {
  pageNumber: number;
  pageSize: number;
  searchQuery: string;
  sortBy: string;
  order: string;
};
export async function getPackages({
  pageNumber,
  pageSize,
  searchQuery,
  sortBy,
  order,
}: GetPackages) {
  const regex = new RegExp(searchQuery, "i");
  const pageNumberPositive = Math.max(pageNumber + 1, 1);
  const query = Package.find({
    $or: [{ name: regex }, { description: regex }],
  })
    .skip((pageNumberPositive - 1) * pageSize)
    .limit(pageSize);

  if (sortBy) {
    const sort: { [key: string]: SortOrder } = {};
    sort[sortBy] = order === "asc" ? 1 : -1;
    query.sort(sort);
  }
  const packages = await query;
  const totalPackages = await Package.countDocuments({
    $or: [{ name: regex }, { description: regex }],
  });
  return {
    packages: packages,
    totalPackages: totalPackages,
  };
}

export async function getOnePackage(id: string) {
  const packageById = await Package.findById(id);
  return packageById;
}

type UpdatePackage = {
  packageData: Partial<PackageDocument>;
  packageId: string;
};
export async function updatePackage({ packageData, packageId }: UpdatePackage) {
  const { name, description, price, duration, durationUnit } = packageData;
  const currency = "usd";
  const metadata = {
    price,
    currency,
  };
  const product = await createProduct(name, description, metadata);
  const productId = product.id;
  let interval_count: number;
  duration > 1 ? (interval_count = duration) : (interval_count = 1);
  const priceObject = await createPrice(
    price,
    currency,
    productId,
    interval_count
  );

  const newData = {
    name,
    description,
    price,
    duration,
    durationUnit,
    stripePackageId: productId,
    stripePackagePriceId: priceObject.id,
  };

  await Package.findByIdAndUpdate(packageId, newData, {
    new: true,
    runValidators: true,
  });
}
export async function deletePackage(packageId: string) {
  await Package.findByIdAndDelete(packageId);
}
