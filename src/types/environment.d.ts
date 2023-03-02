import { MemberDocument } from "../models/member/member.model";

declare global {
  namespace Express {
    interface Request {
      member?: MemberDocument;
    }
  }
}
