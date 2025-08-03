import { Transaction } from "./transaction.model";
import { IUser, Role } from "../user/user.interface"; // Assuming user role/interface
import { QueryBuilder } from "../../utils/QuiryBuilder";
import { transactionSearchableFields } from "./transaction.constant";
import { Types } from "mongoose";

const getTransactionsByAdmin = async (
  query: Record<string, string>,
  {
    userId,
    role,
  }: {
    userId: string;
    role: string;
  }
) => {
  // ✅ Only allow ADMIN to view transactions
  if (role !== Role.ADMIN) {
    throw new Error("Unauthorized access: Only admins can view transactions");
  }

  const queryBuilder = new QueryBuilder(Transaction.find(), query);

  const transactions = await queryBuilder
    .search(transactionSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    transactions.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getSingleTransaction = async (trxId: string) => {
  const transaction = await Transaction.findOne({ trxId });

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  return transaction;
};
export const TransactionServices = {
  getTransactionsByAdmin,
  getSingleTransaction,
};
