import { Transaction } from "../transaction/transaction.model";
import { IsActive } from "../user/user.interface";
import { User } from "../user/user.model";
import { Wallet } from "../wallet/wallet.model";

const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);

const getUserStats = async () => {
  const totalUsersPromise = User.countDocuments();

  const totalActiveUsersPromise = User.countDocuments({
    isActive: IsActive.ACTIVE,
  });
  const totalInActiveUsersPromise = User.countDocuments({
    isActive: IsActive.INACTIVE,
  });
  const totalBlockedUsersPromise = User.countDocuments({
    isActive: IsActive.BLOCKED,
  });

  const newUsersInLast7DaysPromise = User.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });
  const newUsersInLast30DaysPromise = User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  const usersByRolePromise = User.aggregate([
    //stage -1 : Grouping users by role and count total users in each role

    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
      },
    },
  ]);

  const [
    totalUsers,
    totalActiveUsers,
    totalInActiveUsers,
    totalBlockedUsers,
    newUsersInLast7Days,
    newUsersInLast30Days,
    usersByRole,
  ] = await Promise.all([
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
};

const getTransactionsStats = async (
  range: "today" | "7days" | "30days" | "all"
) => {
  const now = new Date();
  let startDate: Date;

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

  const result = await Transaction.aggregate(pipeline);

  const summary: Record<
    string,
    {
      totalCount: number;
      totalAmountOverall: number;
      totalCommissionOverall: number;
      totalFeeOverall: number;
      counts: Record<
        string,
        {
          count: number;
          totalAmount: number;
          totalCommission: number;
          totalFee: number;
        }
      >;
    }
  > = {};

  let totalPlatformTransactionAmount = 0;
  let totalAgentCommission = 0;
  let totalAdminIncome = 0;

  result.forEach((item) => {
    const totalAmountOverall = Number(item.totalAmountOverall.toFixed(2));
    const totalCommissionOverall = Number(
      item.totalCommissionOverall.toFixed(2)
    );
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

    item.counts.forEach((c: any) => {
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
    totalPlatformTransactionAmount: Number(
      totalPlatformTransactionAmount.toFixed(2)
    ),
    totalAgentCommission: Number(totalAgentCommission.toFixed(2)),
    totalAdminIncome: Number(totalAdminIncome.toFixed(2)),
  };
};

const getWalletStats = async () => {
  const stats = await Wallet.aggregate([
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
    } else {
      unblockedWallets = stat.count;
    }
  }

  const totalWallets = blockedWallets + unblockedWallets;

  return {
    totalWallets,
    blockedWallets,
    unblockedWallets,
  };
};
export const StatsServices = {
  getUserStats,
  getTransactionsStats,
  getWalletStats,
};
