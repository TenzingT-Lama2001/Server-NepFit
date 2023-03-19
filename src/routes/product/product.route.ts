import { Router } from "express";
import { productController } from "../../controllers/product";

const router = Router();

router.get("/", productController.getProducts);

router.get("/:productId", productController.getOneProduct);

router.delete("/:productId", productController.deleteProduct);

router.patch("/:productId", productController.updateProduct);

router.post("/", productController.addProduct);

export { router as productRoutes };
