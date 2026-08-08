import { Router } from "express";
import { authenticate } from "../../common/middleware/authenticate.middleware.js";
import { authorize } from "../../common/middleware/authorize.middleware.js";
import { validate } from "../../common/middleware/validate.middleware.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import {
  createChallanSchema,
  listChallansQuerySchema,
} from "./challan.schema.js";
import {
  listChallansController,
  getChallanController,
  createChallanController,
  confirmChallanController,
  cancelChallanController,
} from "./challan.controller.js";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize("ADMIN", "SALES", "ACCOUNTS"),
  validate(listChallansQuerySchema),
  asyncHandler(listChallansController),
);

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "SALES"),
  validate(createChallanSchema),
  asyncHandler(createChallanController),
);

router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "SALES", "ACCOUNTS"),
  asyncHandler(getChallanController),
);

router.post(
  "/:id/confirm",
  authenticate,
  authorize("ADMIN", "SALES"),
  asyncHandler(confirmChallanController),
);

router.post(
  "/:id/cancel",
  authenticate,
  authorize("ADMIN", "SALES"),
  asyncHandler(cancelChallanController),
);

export default router;
