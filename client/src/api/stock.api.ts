import apiClient from "./axios";
import type {
  StockMovement,
  PaginatedData,
  ApiSuccessResponse,
  MovementType,
} from "../types";

export interface CreateStockMovementInput {
  productId: string;
  quantity: number;
  type: MovementType;
  reason: string;
}

export interface ListStockMovementsParams {
  page?: number;
  limit?: number;
  productId?: string;
  type?: MovementType;
}

export const listStockMovements = async (params?: ListStockMovementsParams) => {
  const response = await apiClient.get<
    ApiSuccessResponse<PaginatedData<StockMovement>>
  >("/stock-movements", { params });
  return response.data.data;
};

export const createStockMovement = async (input: CreateStockMovementInput) => {
  const response = await apiClient.post<ApiSuccessResponse<StockMovement>>(
    "/stock-movements",
    input,
  );
  return response.data.data;
};
