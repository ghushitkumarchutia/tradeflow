import { z } from "zod";

export const createChallanSchema = z.object({
  body: z.object({
    customerId: z.string().min(1),
    items: z
      .array(
        z.object({
          productId: z.string().min(1),
          quantity: z.number().int().positive(),
        }),
      )
      .min(1),
  }),
});

export const listChallansQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z.enum(["DRAFT", "CONFIRMED", "CANCELLED"]).optional(),
    customerId: z.string().optional(),
  }),
});

export type CreateChallanInput = z.infer<typeof createChallanSchema>["body"];
export type ListChallansQuery = z.infer<
  typeof listChallansQuerySchema
>["query"];
