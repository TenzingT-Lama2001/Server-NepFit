import { Document, Types } from "mongoose";
import { BadRequestError } from "../../errors";
import Admin, { AdminDocument } from "../../models/admin/admin.model";
import Member, { MemberDocument } from "../../models/member/member.model";
import Staff, { StaffDocument } from "../../models/staff/staff.model";
import Trainer, { TrainerDocument } from "../../models/trainer/trainer.model";
import { generateToken } from "../../utils/generateToken";
import { LoginMember, RegisterUser } from "../member/auth.service";

// export async function login({ email, password }: LoginMember) {
//   const member = await Member.findOne({
//     email,
//   }).select("+password");

//   console.log("member login", member);
//   if (!member) throw new BadRequestError("MEMBER_DOESNT_EXIST");

//   //match the password

//   const isPasswordCorrect = await member.comparePassword(password);

//   if (!isPasswordCorrect) {
//     throw new BadRequestError("INVALID_CREDENTIALS");
//   }

//   const [accessToken, refreshToken] = await generateToken(member);

//   return [accessToken, refreshToken];
// }
let userFound:
  | (MemberDocument & {
      _id: Types.ObjectId;
    })
  | (TrainerDocument & {
      _id: Types.ObjectId;
    })
  | (AdminDocument & {
      _id: Types.ObjectId;
    })
  | (StaffDocument & {
      _id: Types.ObjectId;
    });

export async function login({ email, password }: LoginMember) {
  console.log({ email, password });
  switch (true) {
    case !!(userFound = await Member.findOne({ email }).select("+password")):
      break;
    case !!(userFound = await Trainer.findOne({ email }).select("+password")):
      break;
    case !!(userFound = await Admin.findOne({ email }).select("+password")):
      break;
    default:
      throw new BadRequestError("INVALID_CREDENTIALS");
  }

  const isPasswordCorrect = await userFound.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new BadRequestError("INVALID_CREDENTIALS");
  }

  const [accessToken, refreshToken, user] = await generateToken(userFound);

  return [accessToken, refreshToken, user];
}

export async function register({
  firstName,
  lastName,
  email,
  password,
  role = "member",
}: RegisterUser) {
  switch (role) {
    case "member":
      userFound = await Member.findOne({ email }).select("+password");
      if (userFound) {
        throw new BadRequestError("USER_ALREADY_EXIST");
      }
      userFound = await Member.create({ firstName, lastName, email, password });
      break;
    case "trainer":
      userFound = await Trainer.findOne({ email }).select("+password");
      if (userFound) {
        throw new BadRequestError("USER_ALREADY_EXIST");
      }
      userFound = await Trainer.create({
        firstName,
        lastName,
        email,
        password,
      });
      break;
    case "staff":
      userFound = await Staff.findOne({ email }).select("+password");
      if (userFound) {
        throw new BadRequestError("USER_ALREADY_EXIST");
      }
      userFound = await Staff.create({
        firstName,
        lastName,
        email,
        password,
      });
      break;
    case "admin":
      userFound = await Admin.findOne({ email }).select("+password");
      if (userFound) {
        throw new BadRequestError("USER_ALREADY_EXIST");
      }
      userFound = await Admin.create({ firstName, lastName, email, password });
      break;
    default:
      throw new BadRequestError("USER_ALREADY_EXIST");
  }
}
