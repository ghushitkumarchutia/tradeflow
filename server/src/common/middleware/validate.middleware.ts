import { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod";
import { ApiError } from "../utils/api-error.js";

export const validate = (schema: ZodObject<any, any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const message = result.error.issues
        .map((issue: any) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");
      return next(ApiError.badRequest(message));
    }

    req.body = result.data.body;
    req.query = result.data.query as any;
    req.params = result.data.params as any;
    
    next();
  };
};
