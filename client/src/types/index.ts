export type Role = "ADMIN" | "SALES" | "WAREHOUSE" | "ACCOUNTS";
export type CustomerType = "RETAIL" | "WHOLESALE" | "DISTRIBUTOR";
export type CustomerStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type MovementType = "IN" | "OUT";
export type ChallanStatus = "DRAFT" | "CONFIRMED" | "CANCELLED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId: string | null;
  type: CustomerType;
  status: CustomerStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  category: string;
  unitPrice: number;
  currentStock: number;
  minStockLevel: number;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: MovementType;
  quantity: number;
  reason: string;
  referenceId: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  product: Product;
  user: { name: string };
}

export interface ChallanItem {
  id: string;
  challanId: string;
  productId: string;
  productNameSnapshot: string;
  skuSnapshot: string;
  unitPriceSnapshot: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Challan {
  id: string;
  challanNumber: string;
  customerId: string;
  status: ChallanStatus;
  totalQuantity: number;
  totalAmount: number;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  customer: Customer;
  createdBy: { name: string; email: string };
  items: ChallanItem[];
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface PaginatedData<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
}
