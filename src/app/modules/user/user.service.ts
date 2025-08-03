import { envVars } from "../../config/env";
import {
  IAuthProvider,
  IUser,
  Role,
  AgentApprovalStatus,
} from "./user.interface";
import bcrypt from "bcrypt";
import { User } from "./user.model";
import { Wallet } from "../wallet/wallet.model";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { QueryBuilder } from "../../utils/QuiryBuilder";
import { userSearchableFields } from "./user.constant";
import mongoose, { Types } from "mongoose";
import { Transaction } from "../transaction/transaction.model";

const createUser = async (payload: Partial<IUser>) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { email, password, agentApprovalStatus, ...rest } = payload;

    const hashedPassword = await bcrypt.hash(
      password as string,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: email as string,
    };

    const userData = {
      email,
      password: hashedPassword,
      auths: [authProvider],
      role: Role.USER,
      ...rest,
    };

    // Step 1: Create user within transaction
    const user = await User.create([userData], { session });

    // Step 2: Create wallet within transaction
    const wallet = await Wallet.create(
      [
        {
          owner: user[0]._id,
          balance: 50,
          isBlocked: false,
        },
      ],
      { session }
    );

    // Step 3: Assign wallet to user and save
    user[0].wallet = wallet[0]._id as Types.ObjectId;
    await user[0].save({ session });

    await session.commitTransaction();
    session.endSession();

    return user[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getAllUsers = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(User.find(), query);
  const usersData = queryBuilder
    .filter()
    .search(userSearchableFields)
    .sort()
    .fields()
    .paginate();
  const [data, meta] = await Promise.all([
    usersData.build(),
    queryBuilder.getMeta(),
  ]);
  return {
    data,
    meta,
  };
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
    if (userId !== decodedToken.userId) {
      throw new AppError(401, "You are not authorized");
    }
  }

  const ifUserExist = await User.findById(userId);

  if (!ifUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  if (decodedToken.role === Role.AGENT && ifUserExist.role === Role.ADMIN) {
    throw new AppError(401, "You are not authorized");
  }

  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedUser;
};

const getSingleUser = async (id: string) => {
  const user = await User.findById(id).select("-password");
  return {
    data: user,
  };
};

const getMe = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  return {
    data: user,
  };
};

const requestAgentRole = async (userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid User ID");
  }

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  if (user.role !== Role.USER) {
    throw new Error("Only users can request to become agent");
  }

  if (user.agentApprovalStatus === AgentApprovalStatus.PENDING) {
    throw new Error("Agent request is already pending");
  }
  user.role = Role.AGENT;
  user.agentApprovalStatus = AgentApprovalStatus.PENDING;
  await user.save();

  return user;
};

const approveAgent = async (userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid User ID");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  if (user.role === Role.AGENT && user.agentApprovalStatus === "APPROVED") {
    throw new Error("User is already an approved agent");
  }

  // ✅ Change role and approval status
  user.role = Role.AGENT;
  user.agentApprovalStatus = AgentApprovalStatus.APPROVED;

  // ✅ Create wallet if not exists
  if (!user.wallet) {
    const wallet = await Wallet.create({
      owner: user._id,
      balance: 50,
      isBlocked: false,
    });
    user.wallet = wallet._id as Types.ObjectId;
  }

  await user.save();
  return user;
};

const deleteUser = async (userId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Step 1: Check user exists
    const user = await User.findById(userId).session(session);
    if (!user) throw new Error("User not found");

    // Step 2: Delete all related transactions (both as user and as agent)
    await Transaction.deleteMany({
      $or: [{ user: userId }, { agent: userId }],
    }).session(session);

    // Step 3: Delete wallet
    await Wallet.deleteOne({ owner: userId }).session(session);

    // Step 4: Delete user
    await User.findByIdAndDelete(userId).session(session);

    await session.commitTransaction();
    session.endSession();

    return {
      message: "User, wallet, and transactions deleted successfully.",
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(`Failed to delete user: ${error}`);
  }
};

export const UserServices = {
  createUser,
  updateUser,
  getAllUsers,
  getSingleUser,
  getMe,
  requestAgentRole,
  approveAgent,
  deleteUser,
};
