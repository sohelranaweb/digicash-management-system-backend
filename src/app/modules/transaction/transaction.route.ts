import express from "express";
import { TransactionControllers } from "./transaction.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = express.Router();

router.get(
  "/all-transactions",
  checkAuth(Role.ADMIN),
  TransactionControllers.getTransactionsByAdmin
);

router.get("/transaction/:id", TransactionControllers.getSingleTransaction);

export const TrxRoutes = router;
