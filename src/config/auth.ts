import {
  templateForgotPassword,
  templateRenewPackage,
} from "../constants/email-template";
import config from "./default";
export const authConfig = {
  cookieOptions: {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
    sameSite: false,
  },

  forgotPasswordMail: {
    subject: "Password Reset",
    html: templateForgotPassword,
    generateUrl(forgotToken: string) {
      return `http://localhost:3000/api/member/auth/new-password/${forgotToken}`;
    },
  },

  notificationMail: {
    subject: "Renew package",
    html: templateRenewPackage,
  },
};
