import { Router } from "express";
import { attendanceController } from "../../controllers/attendance";

const router = Router();

router.get("/", attendanceController.getAttendance);

router.get("/membership", attendanceController.getMembersFromMembership);

router.post("/", attendanceController.createAttendance);

export { router as attendanceRoutes };
