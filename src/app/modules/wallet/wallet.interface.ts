// wallet.interface.ts
import { Document, Types } from "mongoose";

export interface IWallet {
  owner: Types.ObjectId;
  balance: number;
  isBlocked: boolean;
  transactions: Types.ObjectId[];
}

export interface IWalletDocument extends IWallet, Document {}
