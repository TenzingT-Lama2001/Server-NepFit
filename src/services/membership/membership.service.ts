import { SortOrder } from "mongoose";
import Membership, {
  MembershipDocument,
} from "../../models/membership/membership.model";
import Program from "../../models/program/program.model";
import Member from "../../models/member/member.model";
import Package from "../../models/package/package.model";
import Trainer from "../../models/trainer/trainer.model";

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
  const query = Membership.find({})
    .skip((pageNumberPositive - 1) * pageSize)
    .limit(pageSize);

  if (sortBy) {
    const sort: { [key: string]: SortOrder } = {};
    sort[sortBy] = order === "asc" ? 1 : -1;
    query.sort(sort);
  }
  const memberships = await query;

  const membershipData = await Promise.all(
    memberships.map(async (membership) => {
      const program = await Program.findById(membership.program);
      const member = await Member.findById(membership.member);
      const packages = await Package.findById(membership.packages);
      const trainer = await Trainer.findById(membership.trainer);
      const startDate = membership.startDate;
      const endDate = membership.endDate;
      return {
        program,
        member,
        packages,
        trainer,
        startDate,
        endDate,
      };
    })
  );
  const totalMemberships = await Membership.countDocuments({});

  return {
    memberships,
    totalMemberships,
    membershipData,
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
