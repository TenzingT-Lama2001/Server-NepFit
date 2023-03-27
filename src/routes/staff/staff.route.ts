import { Router } from "express";
import { adminStaffController } from "../../controllers/admin";

const router = Router();

router.get("/", adminStaffController.getStaffs);

router.get("/:staffId", adminStaffController.getOneStaff);

router.delete("/:staffId", adminStaffController.deleteStaff);

router.patch("/:staffId", adminStaffController.updateStaff);

router.post("/", adminStaffController.createStaff);

export { router as adminStaffRoutes };
