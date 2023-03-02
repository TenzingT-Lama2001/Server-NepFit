import * as dotenv from "dotenv";

dotenv.config({
  path: ".env",
});
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Member from "../../models/member/member.model";
import { BadRequestError } from "../../errors";
import { generateToken } from "../../utils/generateToken";
import { authConfig } from "../../config/auth";
import { mailHelper } from "../../utils/mailHelper";
import crypto from "crypto";
type RegisterMember = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type LoginMember = Pick<RegisterMember, "email" | "password">;

export async function register({
  firstName,
  lastName,
  email,
  password,
}: RegisterMember) {
  const member = await Member.findOne({ email });

  if (member) throw new BadRequestError("USER_ALREADY_EXIST");

  await Member.create({
    firstName,
    lastName,
    email,
    password,
  });
}

export async function login({ email, password }: LoginMember) {
  const member = await Member.findOne({
    email,
  }).select("+password");
  console.log("member login", member);
  if (!member) throw new BadRequestError("MEMBER_DOESNT_EXIST");

  //match the password

  const isPasswordCorrect = await member.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new BadRequestError("INVALID_CREDENTIALS");
  }

  const [accessToken, refreshToken, user] = await generateToken(member);

  return [accessToken, refreshToken, user];
}

export async function forgotPassword(email: string) {
  const member = await Member.findOne({ email });
  console.log("member", member);
  if (!member) throw new BadRequestError("MEMBER_DOESNT_EXIST");

  const forgotToken = await member.getForgotPasswordToken();
  await member.save({ validateBeforeSave: false });
  console.log("forgotToken", forgotToken);
  const { subject, html, generateUrl } = authConfig.forgotPasswordMail;

  try {
    await mailHelper({
      email: [email],
      subject,
      html: html.replace("$URL$", generateUrl(forgotToken)),
    });
    console.log("member forgot password token", member.forgotPasswordToken);
    console.log("member forgot password expiry", member.forgotPasswordExpiry);
  } catch (error) {
    member.forgotPasswordToken = undefined;
    member.forgotPasswordExpiry = undefined;
    await member.save({ validateBeforeSave: false });
    throw new BadRequestError("FAILED_T0_SEND_EMAIL");
  }
}

type ResetPassword = {
  resetToken: string;
  password: string;
  confirmPassword: string;
};
export async function resetPassword({
  resetToken,
  password,
  confirmPassword,
}: ResetPassword) {
  console.log("resetToken", resetToken);
  const encryptedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ encryptedToken });

  const member = await Member.findOne({
    forgotPasswordToken: encryptedToken,
    forgotPasswordExpiry: {
      $gt: Date.now(),
    },
  });

  console.log("member", member);

  if (!member) {
    throw new BadRequestError("SESSION_EXPIRED");
  }

  if (password !== confirmPassword) {
    throw new BadRequestError("PASSWORD_MISMATCH");
  }

  member.password = password;
  member.forgotPasswordToken = undefined;
  member.forgotPasswordExpiry = undefined;
  await member.save();
  const [accessToken, refreshToken] = await generateToken(member);

  return [accessToken, refreshToken];
}
