import { z } from "zod";

export const createStockMovementSchema = z.object({
  body: z.object({
    productId: z.string().min(1),
    quantity: z.number().int().positive(),
    type: z.enum(["IN", "OUT"]),
    reason: z.string().min(1),
  }),
});

export const listStockMovementsQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    productId: z.string().optional(),
    type: z.enum(["IN", "OUT"]).optional(),
  }),
});

export type CreateStockMovementInput = z.infer<
  typeof createStockMovementSchema
>["body"];
export type ListStockMovementsQuery = z.infer<
  typeof listStockMovementsQuerySchema
>["query"];
