import apiClient from "./axios";
import type {
  Challan,
  PaginatedData,
  ApiSuccessResponse,
  ChallanStatus,
} from "../types";

export interface CreateChallanItemInput {
  productId: string;
  quantity: number;
}

export interface CreateChallanInput {
  customerId: string;
  items: CreateChallanItemInput[];
}

export interface ListChallansParams {
  page?: number;
  limit?: number;
  status?: ChallanStatus;
  customerId?: string;
}

export const listChallans = async (params?: ListChallansParams) => {
  const response = await apiClient.get<
    ApiSuccessResponse<PaginatedData<Challan>>
  >("/challans", { params });
  return response.data.data;
};

export const getChallan = async (id: string) => {
  const response = await apiClient.get<ApiSuccessResponse<Challan>>(
    `/challans/${id}`,
  );
  return response.data.data;
};

export const createChallan = async (input: CreateChallanInput) => {
  const response = await apiClient.post<ApiSuccessResponse<Challan>>(
    "/challans",
    input,
  );
  return response.data.data;
};

export const confirmChallan = async (id: string) => {
  const response = await apiClient.post<ApiSuccessResponse<Challan>>(
    `/challans/${id}/confirm`,
  );
  return response.data.data;
};

export const cancelChallan = async (id: string) => {
  const response = await apiClient.post<ApiSuccessResponse<Challan>>(
    `/challans/${id}/cancel`,
  );
  return response.data.data;
};
