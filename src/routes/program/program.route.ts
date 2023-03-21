import { Router } from "express";
import { programController } from "../../controllers/program";

const router = Router();

router.get("/", programController.getPrograms);

router.get("/:programId", programController.getOneProgram);

router.delete("/:programId", programController.deleteProgram);

router.patch("/:programId", programController.updateProgram);

router.post("/", programController.addProgram);

export { router as programRoutes };
