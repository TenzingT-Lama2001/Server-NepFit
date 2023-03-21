import { Router } from "express";
import { stripeController } from "../../controllers/stripe";

const router = Router();

// router.post("/create-customer", stripeController.createCustomer);
// router.post("/create-product", stripeController.createProduct);
// router.post("/create-price", stripeController.createPrice);
router.post("/create-subscription", stripeController.createSubscription);
// router.get("/invoice-preview", stripeController.createInvoicePreview);
router.get("/invoice-list", stripeController.getInvoiceList);
// router.post("/cancel-subscription", stripeController.cancelSubscription);

export { router as stripeRoutes };
