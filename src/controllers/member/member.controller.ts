import { Request, Response, NextFunction } from "express";
import { authConfig } from "../../config/auth";
import { BadRequestError } from "../../errors";
import { CustomError } from "../../errors/custom.error";
import { lang } from "../../lang";
import Member from "../../models/member/member.model";
import { memberAuthService } from "../../services/member";

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
export async function login(req: Request, res: Response) {
  const [accessToken, refreshToken] = await memberAuthService.login(req.body);
  res
    .status(200)
    .cookie("refreshToken", refreshToken, authConfig.cookieOptions)
    .json({ accessToken });
}
export async function logout(req: Request, res: Response) {
  res.cookie("refreshToken", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    message: lang.en.SUCCESS,
  });
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
