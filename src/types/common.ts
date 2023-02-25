import { errorMsgs } from "../lang";

export interface PAagination {
  pageNumber: number;
  pageSize: number;
}

//ErrorMsgKey = USER_DOESNT_EXIST | INVALID_CREDENTIALS | VERIFY_EMAIL etc..
export type ErrorMsgKey = keyof typeof errorMsgs.en;
