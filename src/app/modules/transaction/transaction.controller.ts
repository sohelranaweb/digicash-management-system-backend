import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { TransactionServices } from "./transaction.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { IUser } from "../user/user.interface";

const getTransactionsByAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const query = req.query;
    const decodedToken = req.user as JwtPayload;
    console.log("decoded user", decodedToken);
    const result = await TransactionServices.getTransactionsByAdmin(
      query as Record<string, string>,
      {
        userId: decodedToken.userId,
        role: decodedToken.role,
      }
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All Transactions Retrieved Successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

const getSingleTransaction = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await TransactionServices.getSingleTransaction(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Transaction fetched successfully",
    data: result,
  });
});

export const TransactionControllers = {
  getTransactionsByAdmin,
  getSingleTransaction,
};
