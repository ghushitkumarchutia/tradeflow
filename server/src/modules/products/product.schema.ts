import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    productName: z.string().min(1),
    sku: z.string().min(1),
    category: z.string().min(1),
    unitPrice: z.number().positive(),
    currentStock: z.number().int().nonnegative().default(0),
    minimumStockAlertQuantity: z.number().int().nonnegative().default(0),
    warehouseLocation: z.string().min(1),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    productName: z.string().min(1).optional(),
    sku: z.string().min(1).optional(),
    category: z.string().min(1).optional(),
    unitPrice: z.number().positive().optional(),
    minimumStockAlertQuantity: z.number().int().nonnegative().optional(),
    warehouseLocation: z.string().min(1).optional(),
  }),
});

export const listProductsQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
    category: z.string().optional(),
  }),
});

export type CreateProductInput = z.infer<typeof createProductSchema>["body"];
export type UpdateProductInput = z.infer<typeof updateProductSchema>["body"];
export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>["query"];
