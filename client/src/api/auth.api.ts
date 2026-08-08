import apiClient from "./axios";
import type { User, ApiSuccessResponse } from "../types";

export const login = async (email: string, password: string) => {
  const response = await apiClient.post<
    ApiSuccessResponse<{ accessToken: string; user: User }>
  >("/auth/login", {
    email,
    password,
  });
  return response.data.data;
};
