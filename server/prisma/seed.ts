// prisma/seed.ts
import { PrismaClient, Role, CustomerType } from "../src/generated/prisma/client.js";
import bcrypt from "bcrypt";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();

// Prisma 7 driver adapter pattern setup
const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash("Password123!", 10);

  const users = [
    { name: "Admin User", email: "admin@tradeflow.com", role: Role.ADMIN },
    { name: "Sales User", email: "sales@tradeflow.com", role: Role.SALES },
    {
      name: "Warehouse User",
      email: "warehouse@tradeflow.com",
      role: Role.WAREHOUSE,
    },
    {
      name: "Accounts User",
      email: "accounts@tradeflow.com",
      role: Role.ACCOUNTS,
    },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, passwordHash: password },
    });
  }

  console.log("Seeded 4 users, password for all: Password123!");

  const products = [
    {
      productName: "Industrial Widget A",
      sku: "WID-A-100",
      category: "Hardware",
      unitPrice: 150.5,
      currentStock: 500,
      minimumStockAlertQuantity: 50,
      warehouseLocation: "Zone 1-A",
    },
    {
      productName: "Premium Copper Wire (100m)",
      sku: "WIRE-CU-100",
      category: "Electrical",
      unitPrice: 850.0,
      currentStock: 120,
      minimumStockAlertQuantity: 20,
      warehouseLocation: "Zone 2-B",
    },
    {
      productName: "Safety Helmet Class E",
      sku: "HELM-SAFE-E",
      category: "Safety",
      unitPrice: 45.0,
      currentStock: 10,
      minimumStockAlertQuantity: 50,
      warehouseLocation: "Zone 3-C",
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: p,
    });
  }

  console.log("Seeded 3 products for testing!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
