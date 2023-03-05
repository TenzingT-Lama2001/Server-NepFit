import { NextFunction, Request, Response } from "express";
import { authConfig } from "../../config/auth";
import { lang } from "../../lang";
import { commonAuthService } from "../../services/common";

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
    res
      .status(200)
      .cookie("refreshToken", refreshToken, authConfig.cookieOptions)
      .json({ accessToken, refreshToken, user });
  } catch (error) {
    next(error);
  }
}
