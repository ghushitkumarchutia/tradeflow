import { Request, Response } from "express";
import { ApiResponse } from "../../common/utils/api-response.js";
import {
  listChallans,
  getChallanById,
  createChallan,
  confirmChallan,
  cancelChallan,
} from "./challan.service.js";

export const listChallansController = async (req: Request, res: Response) => {
  const result = await listChallans(req.query as any);
  return ApiResponse.ok(res, "Challans retrieved successfully", result);
};

export const getChallanController = async (req: Request, res: Response) => {
  const result = await getChallanById(req.params.id as string);
  return ApiResponse.ok(res, "Challan retrieved successfully", result);
};

export const createChallanController = async (req: Request, res: Response) => {
  const result = await createChallan(req.body, req.user!.id);
  return ApiResponse.created(res, "Challan created successfully", result);
};

export const confirmChallanController = async (req: Request, res: Response) => {
  const result = await confirmChallan(req.params.id as string, req.user!.id);
  return ApiResponse.ok(res, "Challan confirmed successfully", result);
};

export const cancelChallanController = async (req: Request, res: Response) => {
  const result = await cancelChallan(req.params.id as string);
  return ApiResponse.ok(res, "Challan cancelled successfully", result);
};
