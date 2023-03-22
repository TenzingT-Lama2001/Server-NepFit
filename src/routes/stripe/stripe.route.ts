import { Router } from "express";
import { stripeController } from "../../controllers/stripe";
import express from "express";
const router = Router();

// router.post("/create-customer", stripeController.createCustomer);
// router.post("/create-product", stripeController.createProduct);
// router.post("/create-price", stripeController.createPrice);
router.post("/create-subscription", stripeController.createSubscription);
// router.get("/invoice-preview", stripeController.createInvoicePreview);
// router.get("/invoice-list", stripeController.getInvoiceList);
// router.post("/cancel-subscription", stripeController.cancelSubscription);
router.post(
  "/webhooks",
  express.raw({ type: "application/json" }),
  stripeController.webhooks
);
export { router as stripeRoutes };
