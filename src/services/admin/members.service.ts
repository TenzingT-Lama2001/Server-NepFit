import { SortOrder } from "mongoose";
import Member, { MemberDocument } from "../../models/member/member.model";
import { v2 as cloudinary } from "cloudinary";
import Membership from "../../models/membership/membership.model";
export type GetMembers = {
  pageNumber: number;
  pageSize: number;
  searchQuery: string;
  sortBy: string;
  order: string;
};

export async function getMembers({
  pageNumber,
  pageSize,
  searchQuery,
  sortBy,
  order,
}: GetMembers) {
  //   const members = await Member.find();
  //   return members;
  console.log(pageNumber, pageSize, searchQuery, sortBy, order);
  const regex = new RegExp(searchQuery, "i");
  const pageNumberPositive = Math.max(pageNumber + 1, 1);
  const query = Member.find({
    $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
  })
    .skip((pageNumberPositive - 1) * pageSize)
    .limit(pageSize);

  if (sortBy) {
    const sort: { [key: string]: SortOrder } = {};
    sort[sortBy] = order === "asc" ? 1 : -1;
    query.sort(sort);
  }
  const members = await query;
  const totalMembers = await Member.countDocuments({
    $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
  });
  return {
    members: members,
    totalMembers: totalMembers,
  };
}
export async function getOneMember(id: string) {
  const member = await Member.findById(id);
  return member;
}

type UpdateMember = {
  memberData: Partial<MemberDocument>;
  memberId: string;
  image: string;
};

export async function updateMember({
  memberData,
  memberId,
  image,
}: UpdateMember) {
  if (memberData.password === "" || memberData.password === null) {
    delete memberData.password;
  }
  if (image) {
    const response = await cloudinary.uploader.upload(image, {
      folder: "member-profile",
    });

    const { public_id, secure_url } = response;
    const memberImage = {
      id: public_id,
      secure_url,
    };
    const memberDataWithProfile = { ...memberData, avatarUrl: memberImage };
    await Member.findByIdAndUpdate(memberId, memberDataWithProfile, {
      new: true,
      runValidators: true,
    });
  } else {
    await Member.findByIdAndUpdate(memberId, memberData, {
      new: true,
      runValidators: true,
    });
  }
}

export async function deleteMember(memberId: string) {
  await Member.findByIdAndDelete(memberId);
}
type CreateMember = {
  memberData: Partial<MemberDocument>;
  image?: string;
};
export async function createMember({ memberData, image }: CreateMember) {
  if (image) {
    const response = await cloudinary.uploader.upload(image, {
      folder: "member-profile",
    });

    const { public_id, secure_url } = response;
    const memberImage = {
      id: public_id,
      secure_url,
    };
    const memberDataWithProfile = { ...memberData, avatarUrl: memberImage };
    await Member.create(memberDataWithProfile);
    console.log({ response });
  } else {
    await Member.create(memberData);
  }
}

export async function getMembersByTrainer(id: string) {
  const memberships = await Membership.find({ trainer: id });
  const membersId: string[] = [];
  memberships.map((membership: any) => {
    membersId.push(membership.member);
  });

  const membersPromises = membersId.map(async (memberId) => {
    return await Member.findById(memberId);
  });
  const members = await Promise.all(membersPromises);
  const totalMembers = members.length;
  console.log({ members });
  return {
    members,
    totalMembers,
  };
}
