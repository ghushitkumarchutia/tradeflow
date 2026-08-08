import { Router } from "express";
import { authenticate } from "../../common/middleware/authenticate.middleware.js";
import { authorize } from "../../common/middleware/authorize.middleware.js";
import { validate } from "../../common/middleware/validate.middleware.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import {
  createProductSchema,
  updateProductSchema,
  listProductsQuerySchema,
} from "./product.schema.js";
import {
  listProductsController,
  getProductController,
  createProductController,
  updateProductController,
} from "./product.controller.js";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize("ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"),
  validate(listProductsQuerySchema),
  asyncHandler(listProductsController)
);

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "WAREHOUSE"),
  validate(createProductSchema),
  asyncHandler(createProductController)
);

router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"),
  asyncHandler(getProductController)
);

router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN", "WAREHOUSE"),
  validate(updateProductSchema),
  asyncHandler(updateProductController)
);

export default router;
