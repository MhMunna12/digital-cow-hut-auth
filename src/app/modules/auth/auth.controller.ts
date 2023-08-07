import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { AuthService } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";
import config from "../../../config";
import { IUser } from "../user/user.interface";
import { IRefreshTokenResponse } from "./auth.interface";

const createUser = catchAsync(async (req: Request, res: Response) => {
  console.log(req.cookies, "cookie");
  const user = req.body.user;
  // console.log(user);
  const result = await AuthService.createUser(user);
  sendResponse<IUser>(res, {
    statusCode: 200,
    success: true,
    message: "User created successfully!",
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  console.log(loginData);
  const result = await AuthService.loginUser(loginData);
  const { refreshToken, ...others } = result;
  // set refresh token into cookie
  const cookieOptions = {
    secure: config.env === "production",
    httpOnly: true,
  };
  res.cookie("refreshToken", refreshToken, cookieOptions);
  delete result.refreshToken;
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User Login successfully",
    data: others,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await AuthService.refreshTokens(refreshToken);

  // set refresh token into cookie

  const cookieOptions = {
    secure: config.env === "production",
    httpOnly: true,
  };

  res.cookie("refreshToken", refreshToken, cookieOptions);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: 200,
    success: true,
    message: "New access token generated successfully !",
    data: result,
  });
});

export const AuthController = {
  createUser,
  loginUser,
  refreshToken,
};
