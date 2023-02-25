import { BadRequestError } from "../../errors";
import Member from "../../models/member/member.model";
import { generateToken } from "../../utils/generateToken";
import { LoginMember } from "../member/auth.service";

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

  const [accessToken, refreshToken] = await generateToken(member);

  return [accessToken, refreshToken];
}
