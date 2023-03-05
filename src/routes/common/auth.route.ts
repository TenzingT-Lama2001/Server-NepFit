import { Router } from "express";
import { commonAuthController } from "../../controllers/common";

const router = Router();

router.post("/login", commonAuthController.login);
router.post("/register", commonAuthController.register);
export { router as commonAuthRoutes };
