import { Router } from "express";
import { validate } from "../../common/middleware/validate.middleware.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { loginSchema } from "./auth.schema.js";
import { loginController } from "./auth.controller.js";

const router = Router();

router.post("/login", validate(loginSchema), asyncHandler(loginController));

export default router;
