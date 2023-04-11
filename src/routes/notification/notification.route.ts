import { Router } from "express";

import { notificationController } from "../../controllers/notification";

const router = Router();

router.post("/", notificationController.sendNotification);

export { router as notificationRoutes };
