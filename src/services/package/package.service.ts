import { SortOrder } from "mongoose";
import Package, { PackageDocument } from "../../models/package/package.model";

type CreatePackage = {
  packageData: Partial<PackageDocument>;
};
export async function addPackage({ packageData }: CreatePackage) {
  await Package.create(packageData);
}

export type GetPackage = {
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
}: GetPackage) {
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
    packages,
    totalPackages,
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
  await Package.findByIdAndUpdate(packageId, packageData, {
    new: true,
    runValidators: true,
  });
}
export async function deletePackage(packageId: string) {
  await Package.findByIdAndDelete(packageId);
}
