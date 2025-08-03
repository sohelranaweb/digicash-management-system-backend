import express from "express";
import { WalletControllers } from "./wallet.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = express.Router();

router.post("/top-up", checkAuth(Role.USER), WalletControllers.topUp);
router.post("/send-money", checkAuth(Role.USER), WalletControllers.sendMoney);
router.post("/cash-in", checkAuth(Role.AGENT), WalletControllers.cashIn);
router.post("/cash-out", checkAuth(Role.USER), WalletControllers.cashOut);
router.get(
  "/wallet-trnx-history",
  checkAuth(...Object.values(Role)),
  WalletControllers.getWalletWithTransaction
);
router.patch(
  "/unblock/:id",
  checkAuth(Role.ADMIN),
  WalletControllers.unblockWalletController
);

export const WalletRoutes = router;
