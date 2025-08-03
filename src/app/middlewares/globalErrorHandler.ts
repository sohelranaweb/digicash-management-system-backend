/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";

import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";

import { handleCastError } from "../helpers/handleCastError";
import { handleZodError } from "../helpers/handleZodError";
import { handleValidationError } from "../helpers/handleValidationError";
import { handlerDuplicateError } from "../helpers/handleDuplicateError";
// import { deleteImageFromCLoudinary } from "../config/cloudinary.config";

export const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // if (envVars.NODE_ENV === "development") {
  //   console.log(err);
  // }
  //   console.log({ file: req.files });
  //   if (req.file) {
  //     await deleteImageFromCLoudinary(req.file.path);
  //   }

  //   if (req.files && Array.isArray(req.files) && req.files.length) {
  //     const imageUrls = (req.files as Express.Multer.File[]).map(
  //       (file) => file.path
  //     );

  //     await Promise.all(imageUrls.map((url) => deleteImageFromCLoudinary(url)));
  //   }

  let errorSources: any = [
    // {
    //   path: "isDeleted",
    //   message: "Cast Failed",
    // },
  ];
  let statusCode = 500;
  let message = "Something Went Wrong!!";

  // Duplicate error
  if (err.code === 11000) {
    const simplifiedError = handlerDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // Object ID error /CastError
  else if (err.name === "CastError") {
    const simplifiedError = handleCastError();
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // Zod Error
  else if (err.name === "ZodError") {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  }
  // Mongoose Validation Error
  else if (err.name === "ValidationError") {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError.statusCode;
    errorSources = simplifiedError.errorSources;
    message = simplifiedError.message;
  } else if (err instanceof AppError) {
    (statusCode = err.statusCode), (message = err.message);
  } else if (err instanceof Error) {
    (statusCode = 500), (message = err.message);
  }
  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err: envVars.NODE_ENV === "development" ? err : null,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};
