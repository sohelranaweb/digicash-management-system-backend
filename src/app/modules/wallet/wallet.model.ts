
import { Schema, model } from "mongoose";
import { IWalletDocument } from "./wallet.interface";

const WalletSchema = new Schema<IWalletDocument>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Wallet owner is required."],
      unique: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
      min: [50, "Wallet must be initialized with at least 50 taka."],
      set: (v: number) => parseFloat(v.toFixed(2)),
    },
    isBlocked: {
      type: Boolean,
      default: false,
      validate: {
        validator: function (v: boolean) {
          // Only allow false at creation time
          return v === false;
        },
        message: "New wallet cannot be blocked at creation.",
      },
    },
    transactions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Wallet = model<IWalletDocument>("Wallet", WalletSchema);
