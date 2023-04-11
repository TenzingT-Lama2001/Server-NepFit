import { authConfig } from "../../config/auth";
import { BadRequestError } from "../../errors";
import Member from "../../models/member/member.model";
import { mailHelper } from "../../utils/mailHelper";

export async function sendNotification(email: string) {
  const member = await Member.findOne({ email });
  console.log("member", member);
  if (!member) throw new BadRequestError("MEMBER_DOESNT_EXIST");

  const { subject, message } = authConfig.notificationMail;

  try {
    await mailHelper({
      email: [email],
      subject,
      html: message,
    });
  } catch (error) {
    throw new BadRequestError("FAILED_T0_SEND_EMAIL");
  }
}
