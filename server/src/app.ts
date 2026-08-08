import express from "express";
import cors from "cors";
import { env } from "./common/config/env.js";
import { errorHandler } from "./common/middleware/error.middleware.js";
import authRoutes from "./modules/auth/auth.routes.js";
import customerRoutes from "./modules/customers/customer.routes.js";
import productRoutes from "./modules/products/product.routes.js";
import stockRoutes from "./modules/stock/stock.routes.js";
import challanRoutes from "./modules/challans/challan.routes.js";

const app = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/customers", customerRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/stock-movements", stockRoutes);
app.use("/api/v1/challans", challanRoutes);

app.use(errorHandler);

export default app;
