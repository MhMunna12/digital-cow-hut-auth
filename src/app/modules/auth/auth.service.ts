import config from "../../../config/index";
import ApiError from "../../../errors/ApiError";
// import { jwtHelpers } from "../../../helpers/jwt.helper";
import { User } from "../user/user.model";
import {
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from "./auth.interface";
import jwt, { Secret } from "jsonwebtoken";

import { jwtHelpers } from "../../../helpers/jwt.helpers";
import { IUser } from "../user/user.interface";

const createUser = async (payload: IUser): Promise<IUser | null> => {
  const user = await User.create(payload);

  const result = await User.findById(user.id).select("-password");
  return result;
};
const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { phoneNumber, password } = payload;
  // console.log(payload);

  const isUserExist = await User.isUserExit(phoneNumber);

  if (!isUserExist) {
    throw new ApiError(404, "User does not exist");
  }
  if (
    isUserExist.password &&
    !(await User.isPasswordMatch(password, isUserExist.password))
  ) {
    throw new ApiError(400, "Password is incorrect");
  }

  const { id: UserId, phoneNumber: userPhoneNumber, role } = isUserExist;
  const accessToken = jwtHelpers.createToken(
    { userPhoneNumber, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );
  const refreshToken = jwtHelpers.createToken(
    { userPhoneNumber, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );
  console.log(refreshToken);
  return {
    accessToken,
    refreshToken,
  };
};

const refreshTokens = async (token: string): Promise<IRefreshTokenResponse> => {
  //verify token
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as string
    );
  } catch (error) {
    throw new ApiError(403, "Invalid Refresh token");
  }
  const { userPhoneNumber } = verifiedToken;
  const isUserExist = await User.isUserExit(userPhoneNumber);
  if (!isUserExist) {
    throw new ApiError(404, "User does not exist");
  }
  //generate new token

  const newAccessToken = jwtHelpers.createToken(
    {
      id: isUserExist.id,
      role: isUserExist.role,
      phoneNumbers: isUserExist.phoneNumber,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AuthService = {
  createUser,
  loginUser,
  refreshTokens,
};
