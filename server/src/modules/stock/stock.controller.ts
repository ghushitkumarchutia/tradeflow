import { Request, Response } from "express";
import { ApiResponse } from "../../common/utils/api-response.js";
import { listStockMovements, createStockMovement } from "./stock.service.js";

export const listStockMovementsController = async (
  req: Request,
  res: Response,
) => {
  const result = await listStockMovements(req.query as any);
  return ApiResponse.ok(res, "Stock movements retrieved successfully", result);
};

export const createStockMovementController = async (
  req: Request,
  res: Response,
) => {
  const result = await createStockMovement(req.body, req.user!.id);
  return ApiResponse.created(
    res,
    "Stock movement created successfully",
    result,
  );
};
