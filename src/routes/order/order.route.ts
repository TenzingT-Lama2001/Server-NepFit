import { Router } from "express";

import { orderController } from "../../controllers/order";

const router = Router();

router.get("/", orderController.getOrders);

router.get("/:orderId", orderController.getOneOrder);

router.delete("/:orderId", orderController.deleteOrder);

router.patch("/:orderId", orderController.updateOrder);
router.get(
  "/:stripeProductId/order",
  orderController.getOrderByStripeProductId
);
router.get(
  "/:memberId/purchasing-history",
  orderController.getPurchasingHistory
);
router.post("/", orderController.createOrder);

export { router as orderRoutes };
