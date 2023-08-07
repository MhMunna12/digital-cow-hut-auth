import { Model } from "mongoose";

export type UserName = {
  firstName: string;
  middleName: string;
};

export type IUser = {
  id?: string;
  phoneNumber: string;
  role: "seller" | "buyer";
  password: string;
  name: UserName;
  address: string;
  budget: string;
  income: string;
};
export type UserModel = {
  isUserExit(
    phoneNumber: string
  ): Promise<Pick<IUser, "id" | "phoneNumber" | "role" | "password">>;
  isPasswordMatch(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
  hashPassword(givenPassword: string): Promise<{ password: string }>;
} & Model<IUser>;
// export type UserModel = Model<IUser, object>;
