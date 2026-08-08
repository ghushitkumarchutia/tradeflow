import { Request, Response } from "express";
import { login } from "./auth.service.js";
import { ApiResponse } from "../../common/utils/api-response.js";

export const loginController = async (req: Request, res: Response) => {
  const result = await login(req.body);
  return ApiResponse.ok(res, "Login successful", result);
};
