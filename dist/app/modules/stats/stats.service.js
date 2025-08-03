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
exports.StatsServices = void 0;
const transaction_model_1 = require("../transaction/transaction.model");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const wallet_model_1 = require("../wallet/wallet.model");
const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);
const getUserStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalUsersPromise = user_model_1.User.countDocuments();
    const totalActiveUsersPromise = user_model_1.User.countDocuments({
        isActive: user_interface_1.IsActive.ACTIVE,
    });
    const totalInActiveUsersPromise = user_model_1.User.countDocuments({
        isActive: user_interface_1.IsActive.INACTIVE,
    });
    const totalBlockedUsersPromise = user_model_1.User.countDocuments({
        isActive: user_interface_1.IsActive.BLOCKED,
    });
    const newUsersInLast7DaysPromise = user_model_1.User.countDocuments({
        createdAt: { $gte: sevenDaysAgo },
    });
    const newUsersInLast30DaysPromise = user_model_1.User.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
    });
    const usersByRolePromise = user_model_1.User.aggregate([
        //stage -1 : Grouping users by role and count total users in each role
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 },
            },
        },
    ]);
    const [totalUsers, totalActiveUsers, totalInActiveUsers, totalBlockedUsers, newUsersInLast7Days, newUsersInLast30Days, usersByRole,] = yield Promise.all([
        totalUsersPromise,
        totalActiveUsersPromise,
        totalInActiveUsersPromise,
        totalBlockedUsersPromise,
        newUsersInLast7DaysPromise,
        newUsersInLast30DaysPromise,
        usersByRolePromise,
    ]);
    return {
        totalUsers,
        totalActiveUsers,
        totalInActiveUsers,
        totalBlockedUsers,
        newUsersInLast7Days,
        newUsersInLast30Days,
        usersByRole,
    };
});
const getTransactionsStats = (range) => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    let startDate;
    switch (range) {
        case "today":
            startDate = new Date(now.setHours(0, 0, 0, 0));
            break;
        case "7days":
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);
            break;
        case "30days":
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 30);
            break;
        default:
            startDate = new Date("2000-01-01");
    }
    const pipeline = [
        {
            $match: {
                createdAt: { $gte: startDate, $lte: new Date() },
            },
        },
        {
            $group: {
                _id: { type: "$type", status: "$status" },
                count: { $sum: 1 },
                totalAmount: { $sum: "$amount" },
                totalCommission: { $sum: "$commission" },
                totalFee: { $sum: "$fee" },
            },
        },
        {
            $group: {
                _id: "$_id.type",
                counts: {
                    $push: {
                        status: "$_id.status",
                        count: "$count",
                        totalAmount: "$totalAmount",
                        totalCommission: "$totalCommission",
                        totalFee: "$totalFee",
                    },
                },
                totalCount: { $sum: "$count" },
                totalAmountOverall: { $sum: "$totalAmount" },
                totalCommissionOverall: { $sum: "$totalCommission" },
                totalFeeOverall: { $sum: "$totalFee" },
            },
        },
        {
            $project: {
                type: "$_id",
                counts: 1,
                totalCount: 1,
                totalAmountOverall: 1,
                totalCommissionOverall: 1,
                totalFeeOverall: 1,
                _id: 0,
            },
        },
    ];
    const result = yield transaction_model_1.Transaction.aggregate(pipeline);
    const summary = {};
    let totalPlatformTransactionAmount = 0;
    let totalAgentCommission = 0;
    let totalAdminIncome = 0;
    result.forEach((item) => {
        const totalAmountOverall = Number(item.totalAmountOverall.toFixed(2));
        const totalCommissionOverall = Number(item.totalCommissionOverall.toFixed(2));
        const totalFeeOverall = Number(item.totalFeeOverall.toFixed(2));
        summary[item.type] = {
            totalCount: item.totalCount,
            totalAmountOverall,
            totalCommissionOverall,
            totalFeeOverall,
            counts: {},
        };
        totalPlatformTransactionAmount += totalAmountOverall;
        totalAgentCommission += totalCommissionOverall;
        totalAdminIncome += totalFeeOverall;
        item.counts.forEach((c) => {
            summary[item.type].counts[c.status] = {
                count: c.count,
                totalAmount: Number(c.totalAmount.toFixed(2)),
                totalCommission: Number(c.totalCommission.toFixed(2)),
                totalFee: Number(c.totalFee.toFixed(2)),
            };
        });
    });
    return {
        summary,
        totalPlatformTransactionAmount: Number(totalPlatformTransactionAmount.toFixed(2)),
        totalAgentCommission: Number(totalAgentCommission.toFixed(2)),
        totalAdminIncome: Number(totalAdminIncome.toFixed(2)),
    };
});
const getWalletStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield wallet_model_1.Wallet.aggregate([
        {
            $group: {
                _id: "$isBlocked",
                count: { $sum: 1 },
            },
        },
    ]);
    let blockedWallets = 0;
    let unblockedWallets = 0;
    for (const stat of stats) {
        if (stat._id === true) {
            blockedWallets = stat.count;
        }
        else {
            unblockedWallets = stat.count;
        }
    }
    const totalWallets = blockedWallets + unblockedWallets;
    return {
        totalWallets,
        blockedWallets,
        unblockedWallets,
    };
});
exports.StatsServices = {
    getUserStats,
    getTransactionsStats,
    getWalletStats,
};
