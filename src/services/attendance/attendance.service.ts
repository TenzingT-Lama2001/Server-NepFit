import mongoose, { SortOrder } from "mongoose";
import Program, { ProgramDocument } from "../../models/program/program.model";
import { v2 as cloudinary } from "cloudinary";
import Attendance, {
  AttendanceDocument,
} from "../../models/attendance/attendance.model";
import Member from "../../models/member/member.model";
import { BadRequestError } from "../../errors";
import Membership from "../../models/membership/membership.model";

export type CreateAttendance = {
  attendanceData: Partial<AttendanceDocument>;
};

export async function createAttendance({
  attendanceData: { member, date, is_present },
}: CreateAttendance) {
  const searchDate = new Date(date);
  searchDate.setHours(0, 0, 0, 0);
  const existingAttendance = await Attendance.findOne({
    member: new mongoose.Types.ObjectId(member),
    date: searchDate,
  });
  console.log("type of member", typeof member);
  console.log("type of date", typeof date);
  console.log({ member, date });
  console.log({ existingAttendance });
  if (existingAttendance) throw new BadRequestError("ATTENDANCE_ALREADY_SAVED");
  const attendance = Attendance.create({
    member,
    date,
    is_present,
  });

  return attendance;
}

// export async function createAttendance({
//   attendanceData,
// }: CreateAttendance): Promise<AttendanceDocument[]> {
//   const attendanceDocs: AttendanceDocument[] = [];

//   for (const [member, attendance] of Object.entries(attendanceData)) {
//     const existingAttendance = await Attendance.findOne({
//       member,
//       date: attendance.date,
//     });
//     if (existingAttendance)
//       throw new BadRequestError("ATTENDANCE_ALREADY_SAVED");

//     const attendanceDoc = await Attendance.create({
//       member,
//       date: attendance.date,
//       is_present: attendance.is_present,
//     });

//     attendanceDocs.push(attendanceDoc);
//   }

//   return attendanceDocs;
// }

export type GetAttendance = {
  attendanceData: Omit<Partial<AttendanceDocument>, "is_present">;
};
// export async function getAttendance({
//   attendanceData: { date },
// }: GetAttendance) {
//   const attendance = await Attendance.findOne({
//     date: new Date(date),
//   });

//   return attendance;
// }

export async function getAttendance({
  attendanceData: { date },
}: GetAttendance) {
  const attendance = await Attendance.find({
    date: {
      $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      $lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
    },
  }).populate("member");

  return attendance;
}
export type GetAttendanceFromMembership = {
  pageNumber: number;
  pageSize: number;
  searchQuery: string;
  sortBy: string;
  order: string;
};
export async function getMembersFromMembership({
  pageNumber,
  pageSize,
  searchQuery,
  sortBy,
  order,
}: GetAttendanceFromMembership) {
  const memberships = await Membership.find({});
  const memberIds = memberships.map((membership) => membership.member);

  const regex = new RegExp(searchQuery, "i");
  const pageNumberPositive = Math.max(pageNumber + 1, 1);
  const query = Member.find({
    _id: { $in: memberIds },
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
    _id: { $in: memberIds },
    $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
  });

  return {
    members: members,
    totalMembers: totalMembers,
  };
}
