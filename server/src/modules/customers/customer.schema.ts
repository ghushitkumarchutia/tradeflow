import { z } from "zod";

export const createCustomerSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    mobileNumber: z.string().min(1),
    email: z.string().email().optional().nullable(),
    businessName: z.string().min(1),
    gstNumber: z.string().optional().nullable(),
    customerType: z.enum(["RETAIL", "WHOLESALE", "DISTRIBUTOR"]),
    address: z.string().min(1),
    status: z.enum(["LEAD", "ACTIVE", "INACTIVE"]).default("LEAD"),
    followUpDate: z.coerce.date().optional().nullable(),
    notes: z.string().optional().nullable(),
  }),
});

export const updateCustomerSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    mobileNumber: z.string().min(1).optional(),
    email: z.string().email().optional().nullable(),
    businessName: z.string().min(1).optional(),
    gstNumber: z.string().optional().nullable(),
    customerType: z.enum(["RETAIL", "WHOLESALE", "DISTRIBUTOR"]).optional(),
    address: z.string().min(1).optional(),
    status: z.enum(["LEAD", "ACTIVE", "INACTIVE"]).optional(),
    followUpDate: z.coerce.date().optional().nullable(),
    notes: z.string().optional().nullable(),
  }),
});

export const listCustomersQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
  }),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>["body"];
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>["body"];
export type ListCustomersQuery = z.infer<
  typeof listCustomersQuerySchema
>["query"];
