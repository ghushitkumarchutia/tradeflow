import { Prisma } from "../../../../generated/prisma/index.js";
import { prisma } from "../../common/config/db.js";
import { ApiError } from "../../common/utils/api-error.js";
import { parsePagination } from "../../common/utils/pagination.js";
import {
  CreateCustomerInput,
  UpdateCustomerInput,
  ListCustomersQuery,
} from "./customer.schema.js";

export const listCustomers = async (query: ListCustomersQuery) => {
  const { page, limit, skip } = parsePagination(query);

  const where: Prisma.CustomerWhereInput = {};

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: "insensitive" } },
      { businessName: { contains: query.search, mode: "insensitive" } },
      { mobileNumber: { contains: query.search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip,
      take: limit,
      orderBy: { name: "asc" },
      include: {
        createdBy: {
          select: { name: true, email: true },
        },
      },
    }),
    prisma.customer.count({ where }),
  ]);

  return {
    items,
    metadata: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getCustomerById = async (id: string) => {
  const customer = await prisma.customer.findUnique({
    where: { id },
  });

  if (!customer) {
    throw ApiError.notFound("Customer not found");
  }

  return customer;
};

export const createCustomer = async (
  input: CreateCustomerInput,
  userId: string,
) => {
  return prisma.customer.create({
    data: {
      ...input,
      createdById: userId,
    },
  });
};

export const updateCustomer = async (
  id: string,
  input: UpdateCustomerInput,
) => {
  const customer = await prisma.customer.findUnique({
    where: { id },
  });

  if (!customer) {
    throw ApiError.notFound("Customer not found");
  }

  return prisma.customer.update({
    where: { id },
    data: input,
  });
};
