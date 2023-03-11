import * as dotenv from "dotenv";
dotenv.config({
  path: ".env",
});
export default {
  SERVER_PORT: process.env.PORT || 3001,
  DATABASE_URL: process.env.DATABASE_URL || "mongodb://localhost:27017",
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_EXPIRY: process.env.JWT_ACCESS_TOKEN_EXPIRY || "1200",
  JWT_REFRESH_TOKEN_EXPIRY: process.env.JWT_REFRESH_TOKEN_EXPIRY || "1500",
  COOKIE_TIME: process.env.COOKIE_TIME || 3,
  SMTP_HOST: process.env.SMTP_HOST || "",
  SMTP_PORT: process.env.SMTP_PORT || "",
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || "",
  USER_EMAIL: process.env.USER_EMAIL || "",
  USER_PASSWORD: process.env.USER_PASSWORD || "",
  CLOUD_NAME: process.env.CLOUD_NAME || "",
  API_KEY: process.env.API_KEY || "",
  API_SECRET: process.env.API_SECRET || "",
};
