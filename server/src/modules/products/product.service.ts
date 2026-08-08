import { Prisma } from "../../../../generated/prisma/index.js";
import { prisma } from "../../common/config/db.js";
import { ApiError } from "../../common/utils/api-error.js";
import { parsePagination } from "../../common/utils/pagination.js";
import { CreateProductInput, UpdateProductInput, ListProductsQuery } from "./product.schema.js";

export const listProducts = async (query: ListProductsQuery) => {
  const { page, limit, skip } = parsePagination(query);

  const where: Prisma.ProductWhereInput = {};

  if (query.search) {
    where.OR = [
      { productName: { contains: query.search, mode: "insensitive" } },
      { sku: { contains: query.search, mode: "insensitive" } },
    ];
  }

  if (query.category) {
    where.category = query.category;
  }

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { productName: "asc" },
    }),
    prisma.product.count({ where }),
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

export const getProductById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw ApiError.notFound("Product not found");
  }

  return product;
};

export const createProduct = async (input: CreateProductInput) => {
  const existingSku = await prisma.product.findUnique({
    where: { sku: input.sku },
  });

  if (existingSku) {
    throw ApiError.conflict("A product with this SKU already exists");
  }

  return prisma.product.create({
    data: input,
  });
};

export const updateProduct = async (id: string, input: UpdateProductInput) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw ApiError.notFound("Product not found");
  }

  if (input.sku && input.sku !== product.sku) {
    const existingSku = await prisma.product.findUnique({
      where: { sku: input.sku },
    });

    if (existingSku) {
      throw ApiError.conflict("A product with this SKU already exists");
    }
  }

  return prisma.product.update({
    where: { id },
    data: input,
  });
};
