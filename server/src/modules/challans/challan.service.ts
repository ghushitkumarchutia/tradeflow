import { Prisma } from "../../../../generated/prisma/index.js";
import { prisma } from "../../common/config/db.js";
import { ApiError } from "../../common/utils/api-error.js";
import { parsePagination } from "../../common/utils/pagination.js";
import { generateChallanNumber } from "../../common/utils/challan-number.js";
import { CreateChallanInput, ListChallansQuery } from "./challan.schema.js";

export const listChallans = async (query: ListChallansQuery) => {
  const { page, limit, skip } = parsePagination(query);

  const where: Prisma.ChallanWhereInput = {};

  if (query.status) {
    where.status = query.status;
  }

  if (query.customerId) {
    where.customerId = query.customerId;
  }

  const [items, total] = await Promise.all([
    prisma.challan.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        customer: {
          select: { name: true, businessName: true },
        },
        createdBy: {
          select: { name: true, email: true },
        },
      },
    }),
    prisma.challan.count({ where }),
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

export const getChallanById = async (id: string) => {
  const challan = await prisma.challan.findUnique({
    where: { id },
    include: {
      items: true,
      customer: true,
      createdBy: {
        select: { name: true, email: true },
      },
    },
  });

  if (!challan) {
    throw ApiError.notFound("Challan not found");
  }

  return challan;
};

export const createChallan = async (
  input: CreateChallanInput,
  userId: string,
) => {
  return prisma.$transaction(async (tx) => {
    const customer = await tx.customer.findUnique({
      where: { id: input.customerId },
    });

    if (!customer) {
      throw ApiError.notFound("Customer not found");
    }

    let totalQuantity = 0;
    const challanItemsData: Prisma.ChallanItemCreateWithoutChallanInput[] = [];

    for (const item of input.items) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw ApiError.notFound(`Product with ID ${item.productId} not found`);
      }

      totalQuantity += item.quantity;
      challanItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        productNameSnapshot: product.productName,
        skuSnapshot: product.sku,
        unitPriceSnapshot: product.unitPrice,
      });
    }

    const challanNumber = await generateChallanNumber(tx as any);

    return tx.challan.create({
      data: {
        challanNumber,
        customerId: input.customerId,
        totalQuantity,
        createdById: userId,
        status: "DRAFT",
        items: {
          create: challanItemsData,
        },
      },
      include: {
        items: true,
        customer: true,
      },
    });
  });
};

export const confirmChallan = async (challanId: string, userId: string) => {
  return prisma.$transaction(async (tx) => {
    const challan = await tx.challan.findUnique({
      where: { id: challanId },
      include: { items: true },
    });

    if (!challan) {
      throw ApiError.notFound("Challan not found");
    }

    if (challan.status !== "DRAFT") {
      throw ApiError.conflict(
        `Challan cannot be confirmed. Current status is ${challan.status}`,
      );
    }

    for (const item of challan.items) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw ApiError.notFound(`Product with ID ${item.productId} not found`);
      }

      if (product.currentStock < item.quantity) {
        throw ApiError.conflict(
          `Insufficient stock for product: ${item.productNameSnapshot}`,
        );
      }
    }

    for (const item of challan.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { currentStock: { decrement: item.quantity } },
      });

      await tx.stockMovement.create({
        data: {
          productId: item.productId,
          quantity: item.quantity,
          type: "OUT",
          reason: `Sales Challan ${challan.challanNumber}`,
          createdById: userId,
        },
      });
    }

    return tx.challan.update({
      where: { id: challan.id },
      data: { status: "CONFIRMED" },
      include: {
        items: true,
        customer: true,
      },
    });
  });
};

export const cancelChallan = async (challanId: string) => {
  const challan = await prisma.challan.findUnique({
    where: { id: challanId },
  });

  if (!challan) {
    throw ApiError.notFound("Challan not found");
  }

  if (challan.status !== "DRAFT") {
    throw ApiError.conflict(
      `Only DRAFT challans can be cancelled. Current status is ${challan.status}`,
    );
  }

  return prisma.challan.update({
    where: { id: challanId },
    data: { status: "CANCELLED" },
    include: {
      items: true,
      customer: true,
    },
  });
};
