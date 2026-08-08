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

    if (result.data.body) req.body = result.data.body;
    if (result.data.query) Object.assign(req.query, result.data.query);
    if (result.data.params) Object.assign(req.params, result.data.params);
    
    next();
  };
};
