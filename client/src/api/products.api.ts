import apiClient from "./axios";
import type { Product, PaginatedData, ApiSuccessResponse } from "../types";

export interface CreateProductInput {
  sku: string;
  name: string;
  description?: string;
  category: string;
  unitPrice: number;
  minStockLevel?: number;
}

export type UpdateProductInput = Partial<CreateProductInput>;

export interface ListProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

export const listProducts = async (params?: ListProductsParams) => {
  const response = await apiClient.get<
    ApiSuccessResponse<PaginatedData<Product>>
  >("/products", { params });
  return response.data.data;
};

export const getProduct = async (id: string) => {
  const response = await apiClient.get<ApiSuccessResponse<Product>>(
    `/products/${id}`,
  );
  return response.data.data;
};

export const createProduct = async (input: CreateProductInput) => {
  const response = await apiClient.post<ApiSuccessResponse<Product>>(
    "/products",
    input,
  );
  return response.data.data;
};

export const updateProduct = async (id: string, input: UpdateProductInput) => {
  const response = await apiClient.patch<ApiSuccessResponse<Product>>(
    `/products/${id}`,
    input,
  );
  return response.data.data;
};
