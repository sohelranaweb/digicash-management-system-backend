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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionServices = void 0;
const transaction_model_1 = require("./transaction.model");
const user_interface_1 = require("../user/user.interface"); // Assuming user role/interface
const QuiryBuilder_1 = require("../../utils/QuiryBuilder");
const transaction_constant_1 = require("./transaction.constant");
const getTransactionsByAdmin = (query_1, _a) => __awaiter(void 0, [query_1, _a], void 0, function* (query, { userId, role, }) {
    // ✅ Only allow ADMIN to view transactions
    if (role !== user_interface_1.Role.ADMIN) {
        throw new Error("Unauthorized access: Only admins can view transactions");
    }
    const queryBuilder = new QuiryBuilder_1.QueryBuilder(transaction_model_1.Transaction.find(), query);
    const transactions = yield queryBuilder
        .search(transaction_constant_1.transactionSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        transactions.build(),
        queryBuilder.getMeta(),
    ]);
    return {
        data,
        meta,
    };
});
const getSingleTransaction = (trxId) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield transaction_model_1.Transaction.findOne({ trxId });
    if (!transaction) {
        throw new Error("Transaction not found");
    }
    return transaction;
});
exports.TransactionServices = {
    getTransactionsByAdmin,
    getSingleTransaction,
};
