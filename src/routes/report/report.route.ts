import { Router } from "express";
import { reportController } from "../../controllers/report";

const router = Router();
// router.get("/:memberId", reportController.getReportByMemberId);
router.get("/members", reportController.getMembersByTrainerId);

router.get("/", reportController.getReportByMemberId);
router.post("/", reportController.createReport);

export { router as reportRoutes };
