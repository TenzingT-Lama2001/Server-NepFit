import { SortOrder } from "mongoose";
import Membership, {
  MembershipDocument,
} from "../../models/membership/membership.model";

export interface CreateMembership {
  member: string;
  program: string;
  packages: string;
  startDate: Date;
  endDate: Date;
  isActive?: Boolean;
}
export async function createMembership({
  member,
  program,
  packages,
  startDate,
  endDate,
  isActive = true,
}: CreateMembership) {
  await Membership.create({
    member,
    program,
    packages,
    startDate,
    endDate,
    isActive,
  });
}

export type GetMemberships = {
  pageNumber: number;
  pageSize: number;
  searchQuery: string;
  sortBy: string;
  order: string;
};
export async function getMemberships({
  pageNumber,
  pageSize,
  searchQuery,
  sortBy,
  order,
}: GetMemberships) {
  const regex = new RegExp(searchQuery, "i");
  const pageNumberPositive = Math.max(pageNumber + 1, 1);
  const query = Membership.find({
    $or: [{ name: regex }, { description: regex }],
  })
    .skip((pageNumberPositive - 1) * pageSize)
    .limit(pageSize);

  if (sortBy) {
    const sort: { [key: string]: SortOrder } = {};
    sort[sortBy] = order === "asc" ? 1 : -1;
    query.sort(sort);
  }
  const memberships = await query;
  const totalMemberships = await Membership.countDocuments({
    $or: [{ name: regex }, { description: regex }],
  });
  return {
    memberships,
    totalMemberships,
  };
}
export async function getOneMembership(id: string) {
  const membership = await Membership.findById(id);
  return membership;
}

type UpdateMembership = {
  membershipData: Partial<MembershipDocument>;
  membershipId: string;
};
export async function updateMembership({
  membershipData,
  membershipId,
}: UpdateMembership) {
  await Membership.findByIdAndUpdate(membershipId, membershipData, {
    new: true,
    runValidators: true,
  });
}
export async function deleteMembership(membershipId: string) {
  await Membership.findByIdAndDelete(membershipId);
}
