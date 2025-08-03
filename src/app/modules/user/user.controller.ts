import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { UserServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await UserServices.createUser(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User Created Successfully",
    data: user,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await UserServices.getAllUsers(
    query as Record<string, string>
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All Users Retrieved Successfully",
    data: result.data,
    meta: result.meta,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;

  const verifiedToken = req.user;
  const payload = req.body;

  const user = await UserServices.updateUser(
    userId,
    payload,
    verifiedToken as JwtPayload
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User Updated Successfully",
    data: user,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await UserServices.getSingleUser(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Single User Retrieved Successfully",
    data: result.data,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const result = await UserServices.getMe(decodedToken.userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Get me Retrieved Successfully",
    data: result.data,
  });
});

const requestAgentRole = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const user = await UserServices.requestAgentRole(decodedToken.userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Agent request submitted, waiting for admin approval",
    data: user,
  });
});
const approveAgent = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const user = await UserServices.approveAgent(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Agent approved succesfully",
    data: user,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await UserServices.deleteUser(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: result.message,
    data: null,
  });
});

export const UserControllers = {
  createUser,
  getAllUsers,
  updateUser,
  getSingleUser,
  getMe,
  requestAgentRole,
  approveAgent,
  deleteUser,
};
