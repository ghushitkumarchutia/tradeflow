import { Prisma } from "../../../generated/prisma/index.js";

export async function generateChallanNumber(tx: Prisma.TransactionClient): Promise<string> {
  const currentYear = new Date().getFullYear();
  const prefix = `CH-${currentYear}-`;

  const count = await tx.challan.count({
    where: {
      challanNumber: {
        startsWith: prefix,
      },
    },
  });

  const nextSequence = count + 1;
  const sequenceStr = nextSequence.toString().padStart(4, "0");

  return `${prefix}${sequenceStr}`;
}
