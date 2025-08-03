// src/app/modules/transaction/transaction.interface.ts

export type TransactionType =
  | "ADD_MONEY"
  | "SEND_MONEY"
  | "CASH_IN"
  | "CASH_OUT";

export type TransactionStatus = "PENDING" | "COMPLETED" | "REVERSED";

export interface ITransaction {
  type: TransactionType;
  amount: number;
  fee: number; // system fee
  commission: number; // agent commission if applicable

  status: TransactionStatus;

  initiatedBy: "USER" | "AGENT"; // who initiated
  user: string; // who owns the wallet
  agent?: string; // if agent is involved
  reciver?: string; // for SEND_MONEY

  trxId: string; // Unique transaction ID
  reference?: string; // optional note
  createdAt: Date;
  updatedAt: Date;
}
