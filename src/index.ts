import express from "express";
import config from "./config/default";
import connect from "./utils/connect";
import logger from "./utils/logger";
import * as dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { NotFoundError } from "./errors";
import { memberAuthRoutes } from "./routes/member/auth.route";
import { errorHandler } from "./middlewares";
import { commonAuthRoutes } from "./routes/common/auth.route";
import { adminMembersRoutes } from "./routes/admin/members.route";
import { v2 as cloudinary } from "cloudinary";

dotenv.config({
  path: ".env",
});
const app = express();

const corsOptions = {
  origin: ["http://localhost:3000"],
  credentials: true,
  optionSuccessStatus: 200,
};

const port = config.SERVER_PORT;
cloudinary.config({
  cloud_name: config.CLOUD_NAME,
  api_key: config.API_KEY,
  api_secret: config.API_SECRET,
});
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//member routes
app.use("/api/member/auth", memberAuthRoutes);
app.use("/api/common/auth", commonAuthRoutes);
app.use("/api/admin/members", adminMembersRoutes);
app.all("*", async (_req, _res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

app.listen(port, async () => {
  logger.info(`App is running at http://localhost:${port}`);
  await connect();
});
