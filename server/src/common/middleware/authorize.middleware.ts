import { Request, Response, NextFunction } from "express";
import { Role } from "../../../../generated/prisma/index.js";
import { ApiError } from "../utils/api-error.js";

export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return next(ApiError.forbidden("Access denied: User not authenticated properly"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(ApiError.forbidden("Access denied: Insufficient permissions"));
    }

    next();
  };
};
