import { Router } from "express";
import { commonAuthController } from "../../controllers/common";

const router = Router();

router.post("/login", commonAuthController.login);
router.post("/register", commonAuthController.register);
router.post("/logout", commonAuthController.logout);
router.get("/refresh", commonAuthController.refreshToken);
router.post("/upload/profile", commonAuthController.uploadProfile);
export { router as commonAuthRoutes };
