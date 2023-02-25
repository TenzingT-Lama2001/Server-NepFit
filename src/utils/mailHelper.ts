import nodemailer, { Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import config from "../config/default";
interface TransportOptions extends SMTPTransport.Options {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface SendMailOption {
  email: string[];
  subject: string;
  html: string;
}
export const mailHelper = async (option: SendMailOption) => {
  const transporterOptions: TransportOptions = {
    host: config.SMTP_HOST,
    port: Number(config.SMTP_PORT),
    secure: false,
    requireTLS: true,
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS,
    },
  };

  let transporter = nodemailer.createTransport(transporterOptions);

  const message = {
    from: config.SMTP_USER, //sender address
    to: option.email, //list of receivers
    subject: option.subject, //subject line
    html: option.html,
  };

  //send mail with defined transport object

  await transporter.sendMail(message);
};
