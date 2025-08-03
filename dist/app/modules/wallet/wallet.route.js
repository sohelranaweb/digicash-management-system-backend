"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletRoutes = void 0;
const express_1 = __importDefault(require("express"));
const wallet_controller_1 = require("./wallet.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const router = express_1.default.Router();
router.post("/top-up", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), wallet_controller_1.WalletControllers.topUp);
router.post("/send-money", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), wallet_controller_1.WalletControllers.sendMoney);
router.post("/cash-in", (0, checkAuth_1.checkAuth)(user_interface_1.Role.AGENT), wallet_controller_1.WalletControllers.cashIn);
router.post("/cash-out", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), wallet_controller_1.WalletControllers.cashOut);
router.get("/wallet-trnx-history", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), wallet_controller_1.WalletControllers.getWalletWithTransaction);
router.patch("/unblock/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), wallet_controller_1.WalletControllers.unblockWalletController);
exports.WalletRoutes = router;
