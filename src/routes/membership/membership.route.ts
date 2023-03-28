import { Router } from "express";
import { membershipController } from "../../controllers/membership";

const router = Router();

router.get("/", membershipController.getMemberships);

router.get("/:membershipId", membershipController.getOneMembership);

router.delete("/:membershipId", membershipController.deleteMembership);

router.patch("/:membershipId", membershipController.updateMembership);

router.post("/", membershipController.createMembership);

export { router as membershipRoutes };
