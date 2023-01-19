import mongoose from "mongoose";
import config from "../config/default";
import logger from "./logger";

async function connect() {
  const dbUri = config.dbUri;

  try {
    await mongoose.set("strictQuery", false);
    await mongoose.connect(dbUri);
    logger.info("CONNECTED TO DB");
  } catch (error) {
    logger.error("Could not connect to DB");
    process.exit(1);
  }
}

export default connect;
