import express from "express";
import config from "./config/default";
import connect from "./utils/connect";
import logger from "./utils/logger";

const app = express();

const port = config.port;
app.get("/", (req, res) => {
  return res.send("Hello world");
});

app.listen(port, async () => {
  logger.info(`App is running at http://localhost:${port}`);
  await connect();
});
