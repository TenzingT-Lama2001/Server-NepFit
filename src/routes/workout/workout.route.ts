import { Router } from "express";
import { workoutController } from "../../controllers/workout";

const router = Router();

router.get("/", workoutController.getWorkouts);

router.get("/:workoutId", workoutController.getOneWorkout);
router.get("/:trainerId/workout", workoutController.getWorkoutByTrainerId);

router.delete("/:workoutId", workoutController.deleteWorkout);

router.patch("/:workoutId", workoutController.updateWorkout);

router.post("/", workoutController.createWorkout);

export { router as workoutRoutes };
