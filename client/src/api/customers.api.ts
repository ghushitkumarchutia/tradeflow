import apiClient from "./axios";
import type {
  Customer,
  PaginatedData,
  ApiSuccessResponse,
  CustomerType,
  CustomerStatus,
} from "../types";

export interface CreateCustomerInput {
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId?: string;
  type: CustomerType;
  status?: CustomerStatus;
}

export type UpdateCustomerInput = Partial<CreateCustomerInput>;

export interface ListCustomersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const listCustomers = async (params?: ListCustomersParams) => {
  const response = await apiClient.get<
    ApiSuccessResponse<PaginatedData<Customer>>
  >("/customers", { params });
  return response.data.data;
};

export const getCustomer = async (id: string) => {
  const response = await apiClient.get<ApiSuccessResponse<Customer>>(
    `/customers/${id}`,
  );
  return response.data.data;
};

export const createCustomer = async (input: CreateCustomerInput) => {
  const response = await apiClient.post<ApiSuccessResponse<Customer>>(
    "/customers",
    input,
  );
  return response.data.data;
};

export const updateCustomer = async (
  id: string,
  input: UpdateCustomerInput,
) => {
  const response = await apiClient.patch<ApiSuccessResponse<Customer>>(
    `/customers/${id}`,
    input,
  );
  return response.data.data;
};
