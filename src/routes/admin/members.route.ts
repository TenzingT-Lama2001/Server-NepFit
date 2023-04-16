import { Router } from "express";
import { adminMembersController } from "../../controllers/admin";

const router = Router();

router.get("/", adminMembersController.getMembers);

router.get("/:memberId", adminMembersController.getOneMember);

router.delete("/:memberId", adminMembersController.deleteMember);

router.patch("/:memberId", adminMembersController.updateMember);

router.post("/", adminMembersController.createMember);

router.get("/:trainerId/members", adminMembersController.getMembersByTrainer);
export { router as adminMembersRoutes };
