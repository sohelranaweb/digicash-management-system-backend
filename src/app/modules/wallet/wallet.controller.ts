import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { IUser, Role } from "../user/user.interface";
import { WalletServices } from "./wallet.service";
import { JwtPayload } from "jsonwebtoken";

const topUp = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const { amount, reference } = req.body;

  const result = await WalletServices.topUp(
    decodedToken.userId,
    amount,
    reference
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: `Top up successful. Total deposited: ${result.deposit} ৳`,
    data: {
      oldBalance: result.oldBalance,
      newBalance: result.newBalance,
      trxId: result.trxId,
    },
  });
});
const sendMoney = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const { receiverId, amount, reference } = req.body;

  const result = await WalletServices.sendMoney(
    decodedToken.userId,
    receiverId,
    amount,
    reference
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: result.message,
    data: {
      oldBalance: result.oldBalance,
      newSenderBalance: result.newSenderBalance,
      trxId: result.trxId,
    },
  });
});

const cashIn = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const { userId, amount, reference } = req.body;
  if (!decodedToken.userId) throw new Error("Agent not authenticated");

  const result = await WalletServices.cashIn(
    decodedToken.userId,
    userId,
    amount,
    reference
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: result.message,
    data: {
      oldBalance: result.oldBalance,
      newAgentBalance: result.newAgentBalance,
      trxId: result.trxId,
    },
  });
});

const cashOut = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const { amount, agentWalletId, reference } = req.body;

  const result = await WalletServices.cashOut(
    decodedToken.userId,
    amount,
    agentWalletId,
    reference
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: `Cash out successful. Total deducted: ${result.data.totalDeducted} ৳`,
    data: {
      oldBalance: result.data.oldBalance,
      totalDeducted: result.data.totalDeducted,
      newBalance: result.data.newBalance,
      fee: result.data.fee,
      trxId: result.data.trxId,
    },
  });
});

const getWalletWithTransaction = catchAsync(
  async (req: Request, res: Response) => {
    const query = req.query as Record<string, string>;
    const decodedToken = req.user as JwtPayload;
    const userId = decodedToken.userId;
    const role = decodedToken.role as Role;
    console.log("get wallet trnx decoded", decodedToken);
    const result = await WalletServices.getWalletWithTransaction(
      userId,
      role,
      query
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Wallet and transaction history fetched successfully",
      data: {
        wallet: result.wallet,
        transactions: result.transactions,
      },
      meta: result.meta,
    });
  }
);

const unblockWalletController = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await WalletServices.unblockWalletByAdmin(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Wallet has been unblocked successfully",
      data: result,
    });
  }
);

export const WalletControllers = {
  topUp,
  sendMoney,
  cashIn,
  cashOut,
  getWalletWithTransaction,
  unblockWalletController,
};
