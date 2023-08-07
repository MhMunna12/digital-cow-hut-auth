import { Request, Response } from "express";
import { UserService } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import pick from "../../../shared/pick";
import { IUser } from "./user.interface";

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, ["page", "limit"]);
  const result = await UserService.getAllUser(paginationOptions);
  sendResponse<IUser[]>(res, {
    statusCode: 200,
    success: true,
    message: "User retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});
const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.getSingleUser(id);
  res.status(200).json({
    success: true,
    message: "Single User retrieved successfully!",
    data: result,
  });
});
const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await UserService.updateUser(id, updateData);
  res.status(200).json({
    success: true,
    message: "Update User successfully!",
    data: result,
  });
});
const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.deleteUser(id);
  res.status(200).json({
    success: true,
    message: "Deleted User successfully!",
    data: result,
  });
});
export const UserController = {
  getAllUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
