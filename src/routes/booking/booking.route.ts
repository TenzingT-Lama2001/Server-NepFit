import { Router } from "express";
import { bookingController } from "../../controllers/booking";

const router = Router();
router.get("/approved", bookingController.getApprovedBookings);
router.get("/:bookingId", bookingController.getOneBooking);
router.get("/", bookingController.getBookings);

router.delete("/:bookingId", bookingController.deleteBooking);

router.patch("/", bookingController.updateBooking);

router.post("/", bookingController.createBooking);

export { router as bookingRoutes };
