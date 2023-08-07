import { Model } from "mongoose";
import { ENUM_USER_ROLE } from "../../../enums/user";
export const role = ["admin"];
export type UserName = {
  firstName: string;
  lastName: string;
};

export type IAdmin = {
  id?: string;
  phoneNumber: string;
  role: "admin";
  password: string;
  name: UserName;
  address: string;
};
export type AdminModel = {
  isAdminExist(
    phoneNumber: string
  ): Promise<Pick<IAdmin, "id" | "phoneNumber" | "password" | "role">>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
  hashPassword(givenPassword: string): Promise<{ password: string }>;
} & Model<IAdmin>;

export type ILoginAdmin = {
  phoneNumber: string;
  password: string;
};

export type ILoginAdminResponse = {
  accessToken: string;
  refreshToken?: string;
};

export type IAdminRefreshTokenResponse = {
  accessToken: string;
};

export type IVerifiedLoginAdmin = {
  userId: string;
  role: ENUM_USER_ROLE;
};
