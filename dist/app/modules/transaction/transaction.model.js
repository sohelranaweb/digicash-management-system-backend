"use strict";
// src/app/modules/transaction/transaction.model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const transactionSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ["ADD_MONEY", "SEND_MONEY", "CASH_IN", "CASH_OUT"],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: [1, "Amount must be at least 1"],
    },
    fee: {
        type: Number,
        default: 0,
    },
    commission: {
        type: Number,
        default: 0,
        set: (v) => parseFloat(v.toFixed(2)),
    },
    status: {
        type: String,
        enum: ["PENDING", "COMPLETED", "REVERSED"],
        default: "PENDING",
    },
    initiatedBy: {
        type: String,
        enum: ["USER", "AGENT"],
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    agent: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User", // assuming agents are also under User model
    },
    receiver: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User", // for SEND_MONEY target user
    },
    trxId: {
        type: String,
        required: true,
        unique: true,
    },
    reference: {
        type: String,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.Transaction = (0, mongoose_1.model)("Transaction", transactionSchema);
