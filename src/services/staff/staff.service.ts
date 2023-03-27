import { SortOrder } from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import Staff, { StaffDocument } from "../../models/staff/staff.model";
export type GetStaffs = {
  pageNumber: number;
  pageSize: number;
  searchQuery: string;
  sortBy: string;
  order: string;
};

export async function getStaffs({
  pageNumber,
  pageSize,
  searchQuery,
  sortBy,
  order,
}: GetStaffs) {
  console.log(pageNumber, pageSize, searchQuery, sortBy, order);
  const regex = new RegExp(searchQuery, "i");
  const pageNumberPositive = Math.max(pageNumber + 1, 1);
  const query = Staff.find({
    $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
  })
    .skip((pageNumberPositive - 1) * pageSize)
    .limit(pageSize);

  if (sortBy) {
    const sort: { [key: string]: SortOrder } = {};
    sort[sortBy] = order === "asc" ? 1 : -1;
    query.sort(sort);
  }
  const staffs = await query;
  const totalStaffs = await Staff.countDocuments({
    $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
  });
  return {
    staffs: staffs,
    totalStaffs: totalStaffs,
  };
}
export async function getOneStaff(id: string) {
  const staff = await Staff.findById(id);
  return staff;
}

type UpdateStaff = {
  staffData: Partial<StaffDocument>;
  staffId: string;
  image: string;
};

export async function updateStaff({ staffData, staffId, image }: UpdateStaff) {
  if (staffData.password === "" || staffData.password === null) {
    delete staffData.password;
  }
  if (image) {
    const response = await cloudinary.uploader.upload(image, {
      folder: "staff-profile",
    });

    const { public_id, secure_url } = response;
    const staffImage = {
      id: public_id,
      secure_url,
    };
    const staffDataWithProfile = { ...staffData, avatarUrl: staffImage };
    await Staff.findByIdAndUpdate(staffId, staffDataWithProfile, {
      new: true,
      runValidators: true,
    });
  } else {
    await Staff.findByIdAndUpdate(staffId, staffData, {
      new: true,
      runValidators: true,
    });
  }
}

export async function deleteStaff(staffId: string) {
  await Staff.findByIdAndDelete(staffId);
}
type CreateStaff = {
  staffData: Partial<StaffDocument>;
  image?: string;
};
export async function createStaff({ staffData, image }: CreateStaff) {
  if (image) {
    const response = await cloudinary.uploader.upload(image, {
      folder: "staff-profile",
    });

    const { public_id, secure_url } = response;
    const staffImage = {
      id: public_id,
      secure_url,
    };
    const staffDataWithProfile = { ...staffData, avatarUrl: staffImage };
    await Staff.create(staffDataWithProfile);
    console.log({ response });
  } else {
    await Staff.create(staffData);
  }
}
