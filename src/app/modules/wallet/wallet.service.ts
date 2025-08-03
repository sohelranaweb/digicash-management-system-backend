import mongoose from "mongoose";

import { Wallet } from "../wallet/wallet.model";
import { AgentApprovalStatus, IUser, Role } from "../user/user.interface";
import { Transaction } from "../transaction/transaction.model";
import { IWallet } from "./wallet.interface";
import { User } from "../user/user.model";
import { calculateFeeAndCommissions } from "../../utils/calculateCommission";
import { envVars } from "../../config/env";
import { ArrayQueryBuilder } from "../../utils/ArrayQueryBuilder";

const topUp = async (userId: string, amount: number, reference?: string) => {
  if (amount < 50) throw new Error("Amount must be minimum  50");

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // 1. Find wallet
    const wallet = await Wallet.findOne({ owner: userId }).session(session);
    if (!wallet) {
      throw new Error("Wallet not found");
    }

    // 👉 Save old balance before update
    const oldBalance = wallet.balance;

    // 2. Update wallet balance
    wallet.balance += amount;
    await wallet.save({ session });

    // 3. Create transaction record
    const trxId = `trx_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const [transaction] = await Transaction.create(
      [
        {
          type: "ADD_MONEY",
          amount,
          fee: 0,
          commission: 0,
          status: "COMPLETED",
          initiatedBy: "USER",
          user: userId,
          trxId,
          reference,
        },
      ],
      { session }
    );

    // 4. Push transaction _id to wallet.transactions array
    wallet.transactions.push(transaction._id);
    await wallet.save({ session });

    await session.commitTransaction();
    session.endSession();

    return {
      deposit: amount.toFixed(2),
      oldBalance: oldBalance.toFixed(2),
      newBalance: wallet.balance.toFixed(2),
      trxId,
    };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new Error("Top-up failed: " + error.message);
  }
};

const sendMoney = async (
  senderId: string,
  receiverId: string,
  amount: number,
  reference?: string
) => {
  if (amount < 50) throw new Error("Amount must be minimum  50");
  // ✅ Sender and receiver same check
  if (senderId === receiverId) {
    throw new Error("You cannot send money to yourself.");
  }
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // ১. Sender wallet
    const senderWallet = await Wallet.findOne({ owner: senderId }).session(
      session
    );
    if (!senderWallet) throw new Error("Sender wallet not found");

    // ২. Receiver user check (must be a USER role)
    const receiverUser = await User.findOne({
      _id: receiverId,
      role: "USER",
      isDeleted: { $ne: true },
    }).session(session);
    if (!receiverUser) throw new Error("Receiver is not a valid USER");

    // ৩. Receiver wallet
    const receiverWallet = await Wallet.findOne({ owner: receiverId }).session(
      session
    );
    if (!receiverWallet) throw new Error("Receiver wallet not found");

    if (receiverWallet.isBlocked) {
      throw new Error("Receiver wallet is blocked. Cannot send money.");
    }

    // ৪. Admin wallet খুঁজে পাওয়া (Admin user থেকে)
    const adminUser = await User.findOne({ role: "ADMIN" }).session(session);
    if (!adminUser) throw new Error("Admin user not found");

    const adminWallet = await Wallet.findOne({ owner: adminUser._id }).session(
      session
    );
    if (!adminWallet) throw new Error("Admin wallet not found");

    // ৫. Total deduction (amount + fee)
    const totalDeducted = amount + Number(envVars.TRANSFER_FEE);
    if (senderWallet.balance < totalDeducted) {
      throw new Error("Insufficient balance for amount plus fee");
    }

    const oldBalance = senderWallet.balance;

    // ৬. Deduct amount + fee from sender
    senderWallet.balance -= totalDeducted;

    // ৭. Add amount to receiver
    receiverWallet.balance += amount;

    // ৮. Add fee to admin wallet
    adminWallet.balance += Number(envVars.TRANSFER_FEE);

    // ৯. Save wallets
    await senderWallet.save({ session });
    await receiverWallet.save({ session });
    await adminWallet.save({ session });

    // ১০. Create transaction record
    const trxId = `trx_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    await Transaction.create(
      [
        {
          type: "SEND_MONEY",
          amount,
          fee: Number(envVars.TRANSFER_FEE),
          commission: 0,
          status: "COMPLETED",
          initiatedBy: "USER",
          user: senderId,
          receiver: receiverId,
          trxId,
          reference,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      message: `Successfully sent ${amount} ৳ to user. Fee ${Number(
        envVars.TRANSFER_FEE
      )} ৳ deducted.`,
      oldBalance,
      newSenderBalance: senderWallet.balance,
      trxId,
    };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new Error("Send money failed: " + error.message);
  }
};

const cashIn = async (
  agentId: string,
  userId: string,
  amount: number,
  reference?: string
) => {
  if (amount < 50) throw new Error("Amount must be minimum 50");

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // ✅ Agent approval check
    const agent = await User.findById(agentId).session(session);
    if (!agent) throw new Error("Agent not found");

    if (
      agent.role === Role.AGENT &&
      agent.agentApprovalStatus !== AgentApprovalStatus.APPROVED
    ) {
      throw new Error("Agent is not approved yet");
    }

    const agentWallet = await Wallet.findOne({ owner: agentId }).session(
      session
    );
    if (!agentWallet) throw new Error("Agent wallet not found");

    const user = await User.findOne({
      _id: userId,
      role: "USER",
      isDeleted: { $ne: true },
    }).session(session);
    if (!user) throw new Error("User is not a valid USER");

    const userWallet = await Wallet.findOne({ owner: userId }).session(session);
    if (!userWallet) throw new Error("User wallet not found");

    if (userWallet.isBlocked) {
      throw new Error("User's wallet is blocked. Cash-in not allowed.");
    }

    const adminUser = await User.findOne({ role: "ADMIN" }).session(session);
    if (!adminUser) throw new Error("Admin user not found");

    const adminWallet = await Wallet.findOne({ owner: adminUser._id }).session(
      session
    );
    if (!adminWallet) throw new Error("Admin wallet not found");

    // Agent কে দেয়া কমিশন
    const fee = (amount / 1000) * Number(envVars.BASE_FEE_RATE);
    const agentCommission = fee * Number(envVars.AGENT_COMMISSION_RATE);

    if (agentWallet.balance < amount)
      throw new Error("Insufficient balance in agent wallet");

    if (adminWallet.balance < agentCommission)
      throw new Error(
        "Admin wallet does not have enough balance for commission"
      );

    const oldBalance = agentWallet.balance;

    agentWallet.balance -= amount;
    userWallet.balance += amount;

    adminWallet.balance -= agentCommission;
    agentWallet.balance += agentCommission;

    const trxId = `trx_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const [transaction] = await Transaction.create(
      [
        {
          type: "CASH_IN",
          amount,
          fee: 0,
          commission: agentCommission,
          status: "COMPLETED",
          initiatedBy: "AGENT",
          user: userId,
          agent: agentId,
          trxId,
          reference,
        },
      ],
      { session }
    );

    agentWallet.transactions.push(transaction._id);
    userWallet.transactions.push(transaction._id);
    adminWallet.transactions.push(transaction._id);

    await agentWallet.save({ session });
    await userWallet.save({ session });
    await adminWallet.save({ session });

    await session.commitTransaction();
    session.endSession();

    return {
      message: `Cash in successful. Amount: ${amount} ৳, Agent commission paid from admin wallet: ${agentCommission.toFixed(
        2
      )} ৳`,
      oldBalance,
      newAgentBalance: agentWallet.balance,
      trxId,
    };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new Error("Cash in failed: " + error.message);
  }
};

const cashOut = async (
  userId: string,
  amount: number,
  agentWalletId: string,
  reference?: string
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  if (amount < 50) throw new Error("Amount must be minimum 50");

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 1. Find user wallet
    const userWallet = await Wallet.findOne({ owner: userId }).session(session);
    if (!userWallet) {
      throw new Error("User wallet not found");
    }

    // 2. Calculate fee and commissions
    const { fee, agentCommission, adminCommission } =
      calculateFeeAndCommissions(amount);
    const totalDeducted = amount + fee;

    if (userWallet.balance < totalDeducted) {
      throw new Error(`Insufficient balance. Required: ${totalDeducted}`);
    }

    // 3. Find agent wallet with profile
    const agentWallet = await Wallet.findById(agentWalletId)
      .populate("owner") // populate to access agentApprovalStatus
      .session(session);

    if (!agentWallet || !agentWallet.owner) {
      throw new Error("Agent wallet or profile not found");
    }

    const agent = agentWallet.owner as unknown as IUser;

    if (
      agent.role === Role.AGENT &&
      agent.agentApprovalStatus !== AgentApprovalStatus.APPROVED
    ) {
      throw new Error("Agent exists but is not approved yet");
    }

    // 4. Find admin wallet via admin user
    const adminUser = await User.findOne({ role: "ADMIN" });
    if (!adminUser) {
      throw new Error("Admin user not found");
    }

    const adminWallet = await Wallet.findOne({ owner: adminUser._id }).session(
      session
    );
    if (!adminWallet) {
      throw new Error("Admin wallet not found");
    }

    // 5. Update balances
    userWallet.balance -= parseFloat(totalDeducted.toFixed(2));
    agentWallet.balance += amount + parseFloat(agentCommission.toFixed(2));
    adminWallet.balance += parseFloat(adminCommission.toFixed(2));

    // 7. Create transaction
    const trxId = `trx_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const transaction = await Transaction.create(
      [
        {
          type: "CASH_OUT",
          amount,
          fee,
          commission: agentCommission,
          status: "COMPLETED",
          initiatedBy: "USER",
          user: userId,
          agent: agent._id,
          trxId,
          reference,
        },
      ],
      { session }
    );

    // 8. Push transaction references to wallets
    userWallet.transactions.push(transaction[0]._id);
    agentWallet.transactions.push(transaction[0]._id);
    adminWallet.transactions.push(transaction[0]._id);

    await userWallet.save({ session });
    await agentWallet.save({ session });
    await adminWallet.save({ session });

    // 9. Commit transaction
    await session.commitTransaction();
    session.endSession();

    return {
      data: {
        oldBalance: +(userWallet.balance + totalDeducted).toFixed(2),
        newBalance: +userWallet.balance.toFixed(2),
        fee: +fee.toFixed(2),
        totalDeducted: +totalDeducted.toFixed(2),
        trxId,
      },
    };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new Error("Cash Out failed: " + error.message);
  }
};

const getWalletWithTransaction = async (
  userId: string,
  requesterRole: Role,
  query: Record<string, string>
) => {
  // Wallet খুঁজে নাও
  const wallet = await Wallet.findOne({ owner: userId }).lean();
  if (!wallet) throw new Error("Wallet not found");

  const walletData = {
    balance: wallet.balance,
    isBlocked: wallet.isBlocked,
  };

  let transactions: any[] = [];

  if (requesterRole === Role.USER) {
    transactions = await Transaction.find({ user: userId }).lean();
  } else if (requesterRole === Role.AGENT) {
    transactions = await Transaction.find({ agent: userId }).lean();
  } else if (requesterRole === Role.ADMIN) {
    // Admin শুধু wallet দেখবে, transactions দেখবে না
    transactions = [];
  }

  // Transactions filter করো (তোমার পূর্বের লজিক অনুসারে)
  const filteredTransactions = transactions.map((tx) => {
    if (requesterRole === Role.AGENT) {
      return {
        type: tx.type,
        amount: tx.amount,
        commission: tx.commission,
        trxId: tx.trxId,
      };
    }
    // USER জন্য বা অন্য কাউকে fee দেখানো
    return {
      type: tx.type,
      amount: tx.amount,
      fee: tx.fee,
      trxId: tx.trxId,
    };
  });

  // Array-based pagination and sorting
  const builder = new ArrayQueryBuilder(filteredTransactions, query)
    .sort()
    .paginate();

  const finalTransactions = builder.getResult();
  const meta = builder.getMeta(filteredTransactions.length);

  return {
    wallet: walletData,
    transactions: finalTransactions,
    meta,
  };
};

const unblockWalletByAdmin = async (walletId: string) => {
  const wallet = await Wallet.findById(walletId);

  if (!wallet) {
    throw new Error("Wallet not found");
  }

  if (!wallet.isBlocked) {
    throw new Error("Wallet is already unblocked");
  }

  wallet.isBlocked = false;
  await wallet.save();

  return wallet;
};

export const WalletServices = {
  topUp,
  sendMoney,
  cashIn,
  cashOut,
  getWalletWithTransaction,
  unblockWalletByAdmin,
};
