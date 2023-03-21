import { Document, Types } from "mongoose";
import { Cookies } from "../../controllers/common/auth.controller";
import { BadRequestError, NoContentError } from "../../errors";
import config from "../../config/default";
import Admin, { AdminDocument } from "../../models/admin/admin.model";
import Member, { MemberDocument } from "../../models/member/member.model";
import Staff, { StaffDocument } from "../../models/staff/staff.model";
import Trainer, { TrainerDocument } from "../../models/trainer/trainer.model";
import { generateToken, User } from "../../utils/generateToken";
import { LoginMember, RegisterUser } from "../member/auth.service";
import cloudinary from "cloudinary";
import Stripe from "stripe";
const stripe = new Stripe(config.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});
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

export async function login({
  email,
  password,
}: LoginMember): Promise<[string, string, User]> {
  console.log({ email, password });
  switch (true) {
    case !!(userFound = await Member.findOne({ email }).select("+password")):
      break;
    case !!(userFound = await Trainer.findOne({ email }).select("+password")):
      break;
    case !!(userFound = await Admin.findOne({ email }).select("+password")):
      break;
    case !!(userFound = await Staff.findOne({ email }).select("+password")):
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
      // Create Stripe customer
      const customer = await stripe.customers.create({ email });
      const stripeCustomerId = customer.id;

      // Create member with Stripe customer ID
      const member = await Member.create({
        firstName,
        lastName,
        email,
        password,
        stripeCustomerId,
      });
      userFound = member;
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

type UploadProfile = {
  role?: string;
  avatarUrl: string;
};
export async function uploadProfile({ role, avatarUrl }: UploadProfile) {
  const response = await cloudinary.v2.uploader.upload(avatarUrl, {
    folder: "nepfit-profile",
  });
  console.log(response);
}
