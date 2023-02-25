import jwt from "jsonwebtoken";
import { AdminDocument } from "../models/admin/admin.model";
import { MemberDocument } from "../models/member/member.model";

type GenerateToken = {
  payload: jwt.JwtPayload;
  secretKey: jwt.Secret;
  signOptions: jwt.SignOptions;
};

type User = MemberDocument;

export async function generateToken(user: User) {
  const accessToken = user.getJwtAccessToken();
  const refreshToken = user.getJwtRefreshToken();

  // const cookieOptions = {
  //   httpOnly: true,
  //   sameSite: "None",
  //   secure: true,
  //   maxAge: 24 * 60 * 60 * 1000,
  // };

  user.refreshToken = refreshToken;
  await user.save();

  user.password = undefined;

  return [accessToken, refreshToken];
}
