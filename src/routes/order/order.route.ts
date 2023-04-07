import { Router } from "express";

import { orderController } from "../../controllers/order";

const router = Router();

router.get("/", orderController.getOrders);

router.get("/:orderId", orderController.getOneOrder);

router.delete("/:orderId", orderController.deleteOrder);

router.patch("/:orderId", orderController.updateOrder);

router.post("/", orderController.createOrder);

export { router as orderRoutes };
