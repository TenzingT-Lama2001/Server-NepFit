import { Router } from "express";
import { memberAuthController } from "../../controllers/member";

const router = Router();

// router.post("/register", memberAuthController.register);
// router.post("/login", memberAuthController.login);
// router.post("/logout", memberAuthController.logout);
router.post("/forgot-password", memberAuthController.forgotPassword);
router.post("/new-password/:token", memberAuthController.resetPassword);
// router.get("/refresh", memberAuthController.refreshToken);
export { router as memberAuthRoutes };
