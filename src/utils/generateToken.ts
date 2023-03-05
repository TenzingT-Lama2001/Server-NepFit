import jwt from "jsonwebtoken";
import { AdminDocument } from "../models/admin/admin.model";
import { MemberDocument } from "../models/member/member.model";
import { StaffDocument } from "../models/staff/staff.model";
import { TrainerDocument } from "../models/trainer/trainer.model";

type GenerateToken = {
  payload: jwt.JwtPayload;
  secretKey: jwt.Secret;
  signOptions: jwt.SignOptions;
};

type User = MemberDocument | TrainerDocument | AdminDocument | StaffDocument;

export async function generateToken(user: User) {
  const accessToken = user.getJwtAccessToken();
  const refreshToken = user.getJwtRefreshToken();

  user.refreshToken = refreshToken;
  await user.save();

  user.password = undefined;
  user.refreshToken = undefined;
  return [accessToken, refreshToken, user];
}
