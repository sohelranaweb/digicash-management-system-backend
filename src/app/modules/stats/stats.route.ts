import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { StatsControllers } from "./stats.controller";

const router = express.Router();

router.get("/user", checkAuth(Role.ADMIN), StatsControllers.getUserStats);
router.get(
  "/transactions",
  checkAuth(Role.ADMIN),
  StatsControllers.getTransactionsStats
);
router.get("/wallets", checkAuth(Role.ADMIN), StatsControllers.getWalletStats);

export const StatsRoutes = router;
