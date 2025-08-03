"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const mongoose_1 = require("mongoose");
const WalletSchema = new mongoose_1.Schema({
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Wallet owner is required."],
        unique: true,
    },
    balance: {
        type: Number,
        required: true,
        default: 0,
        min: [50, "Wallet must be initialized with at least 50 taka."],
        set: (v) => parseFloat(v.toFixed(2)),
    },
    isBlocked: {
        type: Boolean,
        default: false,
        validate: {
            validator: function (v) {
                // Only allow false at creation time
                return v === false;
            },
            message: "New wallet cannot be blocked at creation.",
        },
    },
    transactions: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Transaction",
        },
    ],
}, {
    timestamps: true,
    versionKey: false,
});
exports.Wallet = (0, mongoose_1.model)("Wallet", WalletSchema);
