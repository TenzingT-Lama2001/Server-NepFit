import { Request, Response } from "express";
import { lang } from "../../lang";
import { notificationService } from "../../services/notification";

export async function sendNotification(req: Request, res: Response) {
  console.log(req.body);
  await notificationService.sendNotification(req.body.email);
  res.status(200).json({
    message: lang.en.FORGOT_PASSWORD,
  });
}
