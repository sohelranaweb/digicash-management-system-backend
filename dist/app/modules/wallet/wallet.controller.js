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
exports.WalletControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const wallet_service_1 = require("./wallet.service");
const topUp = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const { amount, reference } = req.body;
    const result = yield wallet_service_1.WalletServices.topUp(decodedToken.userId, amount, reference);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: `Top up successful. Total deposited: ${result.deposit} ৳`,
        data: {
            oldBalance: result.oldBalance,
            newBalance: result.newBalance,
            trxId: result.trxId,
        },
    });
}));
const sendMoney = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const { receiverId, amount, reference } = req.body;
    const result = yield wallet_service_1.WalletServices.sendMoney(decodedToken.userId, receiverId, amount, reference);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: result.message,
        data: {
            oldBalance: result.oldBalance,
            newSenderBalance: result.newSenderBalance,
            trxId: result.trxId,
        },
    });
}));
const cashIn = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const { userId, amount, reference } = req.body;
    if (!decodedToken.userId)
        throw new Error("Agent not authenticated");
    const result = yield wallet_service_1.WalletServices.cashIn(decodedToken.userId, userId, amount, reference);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: result.message,
        data: {
            oldBalance: result.oldBalance,
            newAgentBalance: result.newAgentBalance,
            trxId: result.trxId,
        },
    });
}));
const cashOut = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const { amount, agentWalletId, reference } = req.body;
    const result = yield wallet_service_1.WalletServices.cashOut(decodedToken.userId, amount, agentWalletId, reference);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: `Cash out successful. Total deducted: ${result.data.totalDeducted} ৳`,
        data: {
            oldBalance: result.data.oldBalance,
            totalDeducted: result.data.totalDeducted,
            newBalance: result.data.newBalance,
            fee: result.data.fee,
            trxId: result.data.trxId,
        },
    });
}));
const getWalletWithTransaction = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const decodedToken = req.user;
    const userId = decodedToken.userId;
    const role = decodedToken.role;
    console.log("get wallet trnx decoded", decodedToken);
    const result = yield wallet_service_1.WalletServices.getWalletWithTransaction(userId, role, query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Wallet and transaction history fetched successfully",
        data: {
            wallet: result.wallet,
            transactions: result.transactions,
        },
        meta: result.meta,
    });
}));
const unblockWalletController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield wallet_service_1.WalletServices.unblockWalletByAdmin(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Wallet has been unblocked successfully",
        data: result,
    });
}));
exports.WalletControllers = {
    topUp,
    sendMoney,
    cashIn,
    cashOut,
    getWalletWithTransaction,
    unblockWalletController,
};
