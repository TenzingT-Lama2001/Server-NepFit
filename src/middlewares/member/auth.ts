import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthError } from "../../errors";
import config from "../../config/default";
import Member from "../../models/member/member.model";

export function protect() {
  return async (req: Request, _res: Response, next: NextFunction) => {
    let token;

    if (req.headers?.authorization?.startsWith("Bearer")) {
      //Set token from Bearer token in header

      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      //Set token from cookie
      token = req.cookies.token;
    }
    //Make sure token exists
    if (!token) {
      throw new AuthError("UNAUTHORIZED_ACCESS");
    }
    try {
      const decoded: any = jwt.verify(token, config.JWT_ACCESS_TOKEN_SECRET);
      const member = await Member.findById(decoded.id);
      req.member = member;
    } catch (err) {
      throw new AuthError("UNAUTHORIZED_ACCESS");
    }

    next();
  };
}
