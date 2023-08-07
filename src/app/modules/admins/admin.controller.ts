import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { AdminService } from "./admin.service";
import sendResponse from "../../../shared/sendResponse";
import {
  IAdmin,
  IAdminRefreshTokenResponse,
  ILoginAdminResponse,
} from "./admin.interface";
import config from "../../../config";

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  console.log(req.cookies, "cookie");
  const admin = req.body.admin;
  const result = await AdminService.createAdmin(admin);
  sendResponse<IAdmin>(res, {
    statusCode: 200,
    success: true,
    message: "User created successfully!",
    data: result,
  });
});

const loginAdmin = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AdminService.loginAdmin(loginData);
  const { refreshToken, ...others } = result;

  // set refresh token into cookie

  const cookieOptions = {
    secure: config.env === "production",
    httpOnly: true,
  };

  res.cookie("refreshToken", refreshToken, cookieOptions);

  sendResponse<ILoginAdminResponse>(res, {
    statusCode: 200,
    success: true,
    message: "Admin loggedIn successfully !",
    data: others,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await AdminService.refreshToken(refreshToken);

  // set refresh token into cookie

  const cookieOptions = {
    secure: config.env === "production",
    httpOnly: true,
  };

  res.cookie("refreshToken", refreshToken, cookieOptions);

  sendResponse<IAdminRefreshTokenResponse>(res, {
    statusCode: 200,
    success: true,
    message: "Admin loggedIn successfully !",
    data: result,
  });
});

export const AdminController = {
  createAdmin,
  loginAdmin,
  refreshToken,
};
