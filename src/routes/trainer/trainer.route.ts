import { Router } from "express";
import { adminTrainerController } from "../../controllers/admin";

const router = Router();

router.get("/", adminTrainerController.getTrainers);

router.get("/:trainerId", adminTrainerController.getOneTrainer);

router.delete("/:trainerId", adminTrainerController.deleteTrainer);

router.patch("/:trainerId", adminTrainerController.updateTrainer);

router.post("/", adminTrainerController.createTrainer);

export { router as adminTrainerRoutes };
