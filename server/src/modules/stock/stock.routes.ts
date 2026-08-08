import { Router } from "express";
import { authenticate } from "../../common/middleware/authenticate.middleware.js";
import { authorize } from "../../common/middleware/authorize.middleware.js";
import { validate } from "../../common/middleware/validate.middleware.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import {
  createStockMovementSchema,
  listStockMovementsQuerySchema,
} from "./stock.schema.js";
import {
  listStockMovementsController,
  createStockMovementController,
} from "./stock.controller.js";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize("ADMIN", "SALES", "WAREHOUSE"),
  validate(listStockMovementsQuerySchema),
  asyncHandler(listStockMovementsController),
);

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "WAREHOUSE"),
  validate(createStockMovementSchema),
  asyncHandler(createStockMovementController),
);

export default router;
