import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error.js";
import { verifyToken } from "../utils/jwt.utils.js";
import { Role } from "../../generated/prisma/client.js";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(ApiError.unauthorized("Authentication token missing or malformed"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyToken(token) as { id: string; role: Role };
    req.user = payload;
    next();
  } catch (err) {
    return next(ApiError.unauthorized("Invalid or expired token"));
  }
};
