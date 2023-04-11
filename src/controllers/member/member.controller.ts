import { Request, Response, NextFunction } from "express";
import { authConfig } from "../../config/auth";
import { BadRequestError, NoContentError, ForbiddenError } from "../../errors";
import { CustomError } from "../../errors/custom.error";
import { lang } from "../../lang";
import Member from "../../models/member/member.model";
import { memberAuthService } from "../../services/member";
import jwt from "jsonwebtoken";
import config from "../../config/default";
import { MemberDocument } from "../../models/member/member.model";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await memberAuthService.register(req.body);
    res.status(200).json({
      message: lang.en.REGISTERED_SUCCESSFULLY,
    });
  } catch (error) {
    next(error);
  }
}
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const [accessToken, refreshToken, user] = await memberAuthService.login(
      req.body
    );
    // console.log("accessToken", accessToken);
    // console.log("refresh_token_controller", refreshToken);
    res
      .status(200)
      .cookie("refreshToken", refreshToken, authConfig.cookieOptions)
      .json({ accessToken, refreshToken, user });
  } catch (error) {
    next(error);
  }
}
export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) {
      throw new NoContentError("NO_REFRESH_TOKEN");
    }
    const refreshToken = cookies.refreshToken;

    //IS refresh token in db?
    const member = await Member.findOne({ refreshToken }).exec();

    if (!member) {
      res.clearCookie("refreshToken", authConfig.cookieOptions);
    }

    //DELETE REFRESH TOKEN IN DB
    member.refreshToken = "";
    await member.save();

    res.clearCookie("refreshToken", authConfig.cookieOptions);

    res.status(200).json({
      message: lang.en.LOGOUT_SUCCESSFUL,
    });
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(req: Request, res: Response) {
  await memberAuthService.forgotPassword(req.body.email);
  res.status(200).json({
    message: lang.en.FORGOT_PASSWORD,
  });
}

export async function resetPassword(req: Request, res: Response) {
  const resetToken = req.params.token;
  const { password, confirmPassword } = req.body;
  const resetPasswordData = { resetToken, password, confirmPassword };
  const [accessToken, refreshToken] = await memberAuthService.resetPassword(
    resetPasswordData
  );
  res
    .status(200)
    .cookie("refreshToken", refreshToken, authConfig.cookieOptions)
    .json({ accessToken });
}

export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) {
      throw new BadRequestError("UNAUTHORIZED_ACCESS");
    }
    const refreshToken = cookies.refreshToken;

    const member: MemberDocument = await Member.findOne({
      refreshToken,
    }).exec();

    const role = member?.role;

    if (!member) throw new ForbiddenError("FORBIDDEN_ERROR");

    // console.log("member", member);
    // console.log("member id ", member._id);
    // console.log("refresh token ", refreshToken);
    // console.log("config", config.JWT_REFRESH_TOKEN_SECRET);
    // console.log("env", process.env.JWT_REFRESH_TOKEN_SECRET);

    jwt.verify(
      refreshToken,
      config.JWT_REFRESH_TOKEN_SECRET,
      (err: Error, decoded: any) => {
        // console.log("decoded id", decoded);
        if (err || member._id.toString() !== decoded.id) {
          // console.log("in error forbidden");
          // res.clearCookie("refreshToken", authConfig.cookieOptions);
          throw new ForbiddenError("FORBIDDEN_ERROR");
        }

        const accessToken = member.getJwtAccessToken();
        const { email, _id, firstName } = member;
        // console.log("new access token", accessToken);
        res.json({ accessToken, role, email, _id, firstName });
      }
    );
  } catch (err) {
    next(err);
  }
}
