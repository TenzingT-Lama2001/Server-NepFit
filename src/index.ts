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
import { productRoutes } from "./routes/product/product.route";
import { packageRoutes } from "./routes/package/package.route";
import { programRoutes } from "./routes/program/program.route";
import { adminTrainerRoutes } from "./routes/trainer/trainer.route";
import { stripeRoutes } from "./routes/stripe/stripe.route";
import { workoutRoutes } from "./routes/workout/workout.route";
import { adminStaffRoutes } from "./routes/staff/staff.route";
import { membershipRoutes } from "./routes/membership/membership.route";

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
// app.use(express.json({ limit: "50mb" }));

app.use((req, res, next) => {
  if (req.originalUrl === "/api/stripe/webhooks") {
    next(); // Do nothing with the body because I need it in a raw state.
  } else {
    express.json({ limit: "50mb" })(req, res, next); // ONLY do express.json() if the received request is NOT a WebHook from Stripe.
  }
});
app.use(express.urlencoded({ limit: "50mb", extended: true }));

//member routes
app.use("/api/member/auth", memberAuthRoutes);

//common routes
app.use("/api/common/auth", commonAuthRoutes);

//admin routes
app.use("/api/admin/members", adminMembersRoutes);

//product routes
app.use("/api/products", productRoutes);

//package routes
app.use("/api/packages", packageRoutes);

//program routes
app.use("/api/programs", programRoutes);

//trainer routes
app.use("/api/admin/trainers", adminTrainerRoutes);

//stripe routes
app.use("/api/stripe", stripeRoutes);

//workout routes
app.use("/api/trainer/workouts", workoutRoutes);

//staff routes
app.use("/api/admin/staffs", adminStaffRoutes);

//membership routes
app.use("/api/membership", membershipRoutes);
//unknown routes
app.all("*", async (_req, _res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

app.listen(port, async () => {
  logger.info(`App is running at http://localhost:${port}`);
  await connect();
});
