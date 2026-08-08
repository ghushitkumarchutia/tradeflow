import { Prisma } from "../../../../generated/prisma/index.js";
import { prisma } from "../../common/config/db.js";
import { ApiError } from "../../common/utils/api-error.js";
import { parsePagination } from "../../common/utils/pagination.js";
import {
  CreateStockMovementInput,
  ListStockMovementsQuery,
} from "./stock.schema.js";

export const listStockMovements = async (query: ListStockMovementsQuery) => {
  const { page, limit, skip } = parsePagination(query);

  const where: Prisma.StockMovementWhereInput = {};

  if (query.productId) {
    where.productId = query.productId;
  }

  if (query.type) {
    where.type = query.type;
  }

  const [items, total] = await Promise.all([
    prisma.stockMovement.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        product: {
          select: { productName: true, sku: true },
        },
        createdBy: {
          select: { name: true, email: true },
        },
      },
    }),
    prisma.stockMovement.count({ where }),
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

export const createStockMovement = async (
  input: CreateStockMovementInput,
  userId: string,
) => {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: { id: input.productId },
    });

    if (!product) {
      throw ApiError.notFound("Product not found");
    }

    if (input.type === "OUT" && product.currentStock < input.quantity) {
      throw ApiError.conflict("Insufficient stock");
    }

    const stockAdjustment =
      input.type === "IN"
        ? { increment: input.quantity }
        : { decrement: input.quantity };

    await tx.product.update({
      where: { id: input.productId },
      data: { currentStock: stockAdjustment },
    });

    const movement = await tx.stockMovement.create({
      data: {
        productId: input.productId,
        quantity: input.quantity,
        type: input.type,
        reason: input.reason,
        createdById: userId,
      },
    });

    return movement;
  });
};
