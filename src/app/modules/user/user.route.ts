import { Router } from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, udateUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser
);

router.get("/all-users", checkAuth(Role.ADMIN), UserControllers.getAllUsers);

router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe);

router.get("/:id", checkAuth(Role.ADMIN), UserControllers.getSingleUser);
router.patch(
  "/update/:id",
  validateRequest(udateUserZodSchema),
  checkAuth(...Object.values(Role)),
  UserControllers.updateUser
);

router.post(
  "/request-agent",
  checkAuth(Role.USER),
  UserControllers.requestAgentRole
);

router.patch(
  "/approve-agent/:userId",
  checkAuth(Role.ADMIN),
  UserControllers.approveAgent
);

router.delete("/delete/:id", UserControllers.deleteUser);

export const UserRoutes = router;
