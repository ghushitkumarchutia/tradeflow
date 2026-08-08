import { Router } from "express";
import { authenticate } from "../../common/middleware/authenticate.middleware.js";
import { authorize } from "../../common/middleware/authorize.middleware.js";
import { validate } from "../../common/middleware/validate.middleware.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import {
  createCustomerSchema,
  updateCustomerSchema,
  listCustomersQuerySchema,
} from "./customer.schema.js";
import {
  listCustomersController,
  getCustomerController,
  createCustomerController,
  updateCustomerController,
} from "./customer.controller.js";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize("ADMIN", "SALES", "ACCOUNTS"),
  validate(listCustomersQuerySchema),
  asyncHandler(listCustomersController),
);

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "SALES"),
  validate(createCustomerSchema),
  asyncHandler(createCustomerController),
);

router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "SALES", "ACCOUNTS"),
  asyncHandler(getCustomerController),
);

router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN", "SALES"),
  validate(updateCustomerSchema),
  asyncHandler(updateCustomerController),
);

export default router;
