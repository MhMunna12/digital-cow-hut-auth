import { Secret } from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../../errors/ApiError";
import { jwtHelpers } from "../../../helpers/jwt.helpers";
import {
  IAdmin,
  IAdminRefreshTokenResponse,
  ILoginAdmin,
  ILoginAdminResponse,
} from "./admin.interface";
import { Admin } from "./admin.model";

const createAdmin = async (payload: IAdmin): Promise<IAdmin | null> => {
  const admin = await Admin.create(payload);

  // const result = await User.findById(user.id).select("-password");
  return admin;
};

const loginAdmin = async (
  payload: ILoginAdmin
): Promise<ILoginAdminResponse> => {
  const { phoneNumber, password } = payload;

  const isAdminExist = await Admin.isAdminExist(phoneNumber);

  if (!isAdminExist) {
    throw new ApiError(404, "Admin does not exist");
  }

  if (
    isAdminExist.password &&
    !(await Admin.isPasswordMatched(password, isAdminExist.password))
  ) {
    throw new ApiError(401, "Password is incorrect");
  }

  //create access token & refresh token

  const { id: userId, role, phoneNumber: phoneNumbers } = isAdminExist;
  const accessToken = jwtHelpers.createToken(
    { userId, role, phoneNumbers },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { userId, role, phoneNumbers },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (
  token: string
): Promise<IAdminRefreshTokenResponse> => {
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as string
    );
  } catch (err) {
    throw new ApiError(403, "Invalid Refresh Token");
  }

  const { phoneNumbers } = verifiedToken;

  const isAdminExist = await Admin.isAdminExist(phoneNumbers);
  if (!isAdminExist) {
    throw new ApiError(401, "Admin does not exist");
  }
  //generate new token

  const newAccessToken = jwtHelpers.createToken(
    {
      id: isAdminExist.id,
      role: isAdminExist.role,
      phoneNumbers: isAdminExist.phoneNumber,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AdminService = {
  createAdmin,
  loginAdmin,
  refreshToken,
};
