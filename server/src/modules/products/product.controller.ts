import { Request, Response } from "express";
import { ApiResponse } from "../../common/utils/api-response.js";
import {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
} from "./product.service.js";

export const listProductsController = async (req: Request, res: Response) => {
  const result = await listProducts(req.query as any);
  return ApiResponse.ok(res, "Products retrieved successfully", result);
};

export const getProductController = async (req: Request, res: Response) => {
  const result = await getProductById(req.params.id as string);
  return ApiResponse.ok(res, "Product retrieved successfully", result);
};

export const createProductController = async (req: Request, res: Response) => {
  const result = await createProduct(req.body);
  return ApiResponse.created(res, "Product created successfully", result);
};

export const updateProductController = async (req: Request, res: Response) => {
  const result = await updateProduct(req.params.id as string, req.body);
  return ApiResponse.ok(res, "Product updated successfully", result);
};
