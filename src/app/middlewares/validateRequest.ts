import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

export const validateRequest =
  (zodSchema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //       console.log("Old body", req.body);
      // req.body = JSON.parse(req.body.data) || req.body;
      if (req.body.data) {
        req.body = JSON.parse(req.body.data);
      }
      req.body = await zodSchema.parseAsync(req.body);
      //       console.log("New body", req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
