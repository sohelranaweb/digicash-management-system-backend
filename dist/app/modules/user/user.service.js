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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const env_1 = require("../../config/env");
const user_interface_1 = require("./user.interface");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("./user.model");
const wallet_model_1 = require("../wallet/wallet.model");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const QuiryBuilder_1 = require("../../utils/QuiryBuilder");
const user_constant_1 = require("./user.constant");
const mongoose_1 = __importDefault(require("mongoose"));
const transaction_model_1 = require("../transaction/transaction.model");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { email, password, agentApprovalStatus } = payload, rest = __rest(payload, ["email", "password", "agentApprovalStatus"]);
        const hashedPassword = yield bcrypt_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
        const authProvider = {
            provider: "credentials",
            providerId: email,
        };
        const userData = Object.assign({ email, password: hashedPassword, auths: [authProvider], role: user_interface_1.Role.USER }, rest);
        // Step 1: Create user within transaction
        const user = yield user_model_1.User.create([userData], { session });
        // Step 2: Create wallet within transaction
        const wallet = yield wallet_model_1.Wallet.create([
            {
                owner: user[0]._id,
                balance: 50,
                isBlocked: false,
            },
        ], { session });
        // Step 3: Assign wallet to user and save
        user[0].wallet = wallet[0]._id;
        yield user[0].save({ session });
        yield session.commitTransaction();
        session.endSession();
        return user[0];
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const getAllUsers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QuiryBuilder_1.QueryBuilder(user_model_1.User.find(), query);
    const usersData = queryBuilder
        .filter()
        .search(user_constant_1.userSearchableFields)
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        usersData.build(),
        queryBuilder.getMeta(),
    ]);
    return {
        data,
        meta,
    };
});
const updateUser = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.AGENT) {
        if (userId !== decodedToken.userId) {
            throw new AppError_1.default(401, "You are not authorized");
        }
    }
    const ifUserExist = yield user_model_1.User.findById(userId);
    if (!ifUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User Not Found");
    }
    if (decodedToken.role === user_interface_1.Role.AGENT && ifUserExist.role === user_interface_1.Role.ADMIN) {
        throw new AppError_1.default(401, "You are not authorized");
    }
    if (payload.role) {
        if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.AGENT) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
    }
    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.AGENT) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
    }
    const newUpdatedUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });
    return newUpdatedUser;
});
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id).select("-password");
    return {
        data: user,
    };
});
const getMe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).select("-password");
    return {
        data: user,
    };
});
const requestAgentRole = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid User ID");
    }
    const user = yield user_model_1.User.findById(userId);
    if (!user)
        throw new Error("User not found");
    if (user.role !== user_interface_1.Role.USER) {
        throw new Error("Only users can request to become agent");
    }
    if (user.agentApprovalStatus === user_interface_1.AgentApprovalStatus.PENDING) {
        throw new Error("Agent request is already pending");
    }
    user.role = user_interface_1.Role.AGENT;
    user.agentApprovalStatus = user_interface_1.AgentApprovalStatus.PENDING;
    yield user.save();
    return user;
});
const approveAgent = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid User ID");
    }
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    if (user.role === user_interface_1.Role.AGENT && user.agentApprovalStatus === "APPROVED") {
        throw new Error("User is already an approved agent");
    }
    // ✅ Change role and approval status
    user.role = user_interface_1.Role.AGENT;
    user.agentApprovalStatus = user_interface_1.AgentApprovalStatus.APPROVED;
    // ✅ Create wallet if not exists
    if (!user.wallet) {
        const wallet = yield wallet_model_1.Wallet.create({
            owner: user._id,
            balance: 50,
            isBlocked: false,
        });
        user.wallet = wallet._id;
    }
    yield user.save();
    return user;
});
const deleteUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Step 1: Check user exists
        const user = yield user_model_1.User.findById(userId).session(session);
        if (!user)
            throw new Error("User not found");
        // Step 2: Delete all related transactions (both as user and as agent)
        yield transaction_model_1.Transaction.deleteMany({
            $or: [{ user: userId }, { agent: userId }],
        }).session(session);
        // Step 3: Delete wallet
        yield wallet_model_1.Wallet.deleteOne({ owner: userId }).session(session);
        // Step 4: Delete user
        yield user_model_1.User.findByIdAndDelete(userId).session(session);
        yield session.commitTransaction();
        session.endSession();
        return {
            message: "User, wallet, and transactions deleted successfully.",
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw new Error(`Failed to delete user: ${error}`);
    }
});
exports.UserServices = {
    createUser,
    updateUser,
    getAllUsers,
    getSingleUser,
    getMe,
    requestAgentRole,
    approveAgent,
    deleteUser,
};
