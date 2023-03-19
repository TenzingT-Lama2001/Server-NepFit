import { Router } from "express";
import { packageController } from "../../controllers/packages";

const router = Router();

router.get("/", packageController.getPackages);

router.get("/:packageId", packageController.getOnePackage);

router.delete("/:packageId", packageController.deletePackage);

router.patch("/:packageId", packageController.updatePackage);

router.post("/", packageController.addPackage);

export { router as packageRoutes };
