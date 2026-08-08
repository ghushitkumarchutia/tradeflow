import { Request, Response } from "express";
import { ApiResponse } from "../../common/utils/api-response.js";
import {
  listCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
} from "./customer.service.js";

export const listCustomersController = async (req: Request, res: Response) => {
  const result = await listCustomers(req.query as any);
  return ApiResponse.ok(res, "Customers retrieved successfully", result);
};

export const getCustomerController = async (req: Request, res: Response) => {
  const result = await getCustomerById(req.params.id as string);
  return ApiResponse.ok(res, "Customer retrieved successfully", result);
};

export const createCustomerController = async (req: Request, res: Response) => {
  const result = await createCustomer(req.body, req.user!.id);
  return ApiResponse.created(res, "Customer created successfully", result);
};

export const updateCustomerController = async (req: Request, res: Response) => {
  const result = await updateCustomer(req.params.id as string, req.body);
  return ApiResponse.ok(res, "Customer updated successfully", result);
};
