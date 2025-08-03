"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const env_1 = require("../config/env");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const handleCastError_1 = require("../helpers/handleCastError");
const handleZodError_1 = require("../helpers/handleZodError");
const handleValidationError_1 = require("../helpers/handleValidationError");
const handleDuplicateError_1 = require("../helpers/handleDuplicateError");
// import { deleteImageFromCLoudinary } from "../config/cloudinary.config";
const globalErrorHandler = (err, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
    let errorSources = [
    // {
    //   path: "isDeleted",
    //   message: "Cast Failed",
    // },
    ];
    let statusCode = 500;
    let message = "Something Went Wrong!!";
    // Duplicate error
    if (err.code === 11000) {
        const simplifiedError = (0, handleDuplicateError_1.handlerDuplicateError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    // Object ID error /CastError
    else if (err.name === "CastError") {
        const simplifiedError = (0, handleCastError_1.handleCastError)();
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    // Zod Error
    else if (err.name === "ZodError") {
        const simplifiedError = (0, handleZodError_1.handleZodError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    // Mongoose Validation Error
    else if (err.name === "ValidationError") {
        const simplifiedError = (0, handleValidationError_1.handleValidationError)(err);
        statusCode = simplifiedError.statusCode;
        errorSources = simplifiedError.errorSources;
        message = simplifiedError.message;
    }
    else if (err instanceof AppError_1.default) {
        (statusCode = err.statusCode), (message = err.message);
    }
    else if (err instanceof Error) {
        (statusCode = 500), (message = err.message);
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err: env_1.envVars.NODE_ENV === "development" ? err : null,
        stack: env_1.envVars.NODE_ENV === "development" ? err.stack : null,
    });
});
exports.globalErrorHandler = globalErrorHandler;
