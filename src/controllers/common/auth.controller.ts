import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { authConfig } from "../../config/auth";
import { BadRequestError, ForbiddenError, NoContentError } from "../../errors";
import { lang } from "../../lang";
import Admin, { AdminDocument } from "../../models/admin/admin.model";
import Member, { MemberDocument } from "../../models/member/member.model";
import Staff, { StaffDocument } from "../../models/staff/staff.model";
import Trainer, { TrainerDocument } from "../../models/trainer/trainer.model";
import { commonAuthService } from "../../services/common";
import config from "../../config/default";
import jwt from "jsonwebtoken";
import { User } from "../../utils/generateToken";

function isMemberDocument(user: User): user is MemberDocument {
  return user.role === "member";
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log(req.body);
    await commonAuthService.register(req.body);
    res.status(200).json({
      message: lang.en.REGISTERED_SUCCESSFULLY,
    });
  } catch (error) {
    next(error);
  }
}
export async function login(req: Request, res: Response, next: NextFunction) {
  console.log("req.body", req.body);
  try {
    const [accessToken, refreshToken, user] = await commonAuthService.login(
      req.body
    );
    console.log("accessToken", accessToken);
    console.log("refresh_token_controller", refreshToken);

    if (isMemberDocument(user)) {
      const stripeCustomerId = user.stripeCustomerId;
      res.cookie("stripe_customer", stripeCustomerId, {
        maxAge: 900000,
        httpOnly: true,
      });
      // use stripeCustomerId as needed
    }
    res
      .status(200)
      .cookie("refreshToken", refreshToken, authConfig.cookieOptions)

      .json({ accessToken, refreshToken, user });
  } catch (error) {
    next(error);
  }
}

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

export interface Cookies {
  refreshToken?: string;
}
export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const cookies: Cookies = req.cookies;
    if (!cookies?.refreshToken) {
      throw new NoContentError("NO_REFRESH_TOKEN");
    }
    const refreshToken = cookies.refreshToken;
    //IS refresh token in db
    switch (true) {
      case !!(userFound = await Member.findOne({ refreshToken }).exec()):
        break;
      case !!(userFound = await Trainer.findOne({ refreshToken }).exec()):
        break;
      case !!(userFound = await Admin.findOne({ refreshToken }).exec()):
        break;
      case !!(userFound = await Staff.findOne({ refreshToken }).exec()):
        break;
      default:
        throw new BadRequestError("NO_REFRESH_TOKEN");
    }
    console.log("userFound", userFound);
    if (!userFound) {
      res.clearCookie("refreshToken", authConfig.cookieOptions);
    }

    //DELETE REFRESH TOKEN IN DB
    userFound.refreshToken = "";
    await userFound.save();
    res.clearCookie("refreshToken", authConfig.cookieOptions);

    res.status(200).json({
      message: lang.en.LOGOUT_SUCCESSFUL,
    });
  } catch (error) {
    next(error);
  }
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

    switch (true) {
      case !!(userFound = await Member.findOne({ refreshToken }).exec()):
        break;
      case !!(userFound = await Trainer.findOne({ refreshToken }).exec()):
        break;
      case !!(userFound = await Admin.findOne({ refreshToken }).exec()):
        break;
      case !!(userFound = await Staff.findOne({ refreshToken }).exec()):
        break;
      default:
        throw new BadRequestError("NO_REFRESH_TOKEN");
    }
    console.log("user found from refresh", userFound);
    const role = userFound?.role;

    if (!userFound) throw new ForbiddenError("FORBIDDEN_ERROR");

    jwt.verify(
      refreshToken,
      config.JWT_REFRESH_TOKEN_SECRET,
      (err: Error, decoded: any) => {
        console.log("decoded id", decoded);
        if (err || userFound._id.toString() !== decoded.id) {
          console.log("in error forbidden");
          // res.clearCookie("refreshToken", authConfig.cookieOptions);
          throw new ForbiddenError("FORBIDDEN_ERROR");
        }

        const accessToken = userFound.getJwtAccessToken();
        const { email, _id, firstName } = userFound;
        console.log("new access token", accessToken);

        if (isMemberDocument(userFound)) {
          const stripeCustomerId = userFound.stripeCustomerId;
          res.cookie("stripe_customer", stripeCustomerId, {
            maxAge: 86400000,
            httpOnly: true,
          });
          // use stripeCustomerId as needed
        }
        res.json({ accessToken, role, email, _id, firstName });
      }
    );
  } catch (err) {
    next(err);
  }
}

export async function uploadProfile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await commonAuthService.uploadProfile(req.body);
    res.status(200).json({
      message: lang.en.CREATED_SUCCESSFULLY,
    });
  } catch (err) {
    next(err);
  }
}
