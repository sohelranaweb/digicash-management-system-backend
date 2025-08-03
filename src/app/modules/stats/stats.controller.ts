import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { StatsServices } from "./stats.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { WalletServices } from "../wallet/wallet.service";

const getUserStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await StatsServices.getUserStats();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User stats fetched successfully",
    data: stats,
  });
});

const getTransactionsStats = catchAsync(async (req: Request, res: Response) => {
  const range = req.query.range as "today" | "7days" | "30days" | "all";

  const data = await StatsServices.getTransactionsStats(range || "all");

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Admin Dashboard Summary of transactions for range: ${
      range || "all"
    }`,
    data,
  });
});

const getWalletStats = catchAsync(async (req: Request, res: Response) => {
  const wallets = await StatsServices.getWalletStats();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Wallet Summary fetched successfully",
    data: wallets,
  });
});
export const StatsControllers = {
  getUserStats,
  getTransactionsStats,
  getWalletStats,
};
