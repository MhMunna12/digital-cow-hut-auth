import { Model, Types } from "mongoose";
import { IUser } from "../user/user.interface";
export const label = ["for sale", "sold out"];
export type ICow = {
  name: string;
  age: number;
  price: number;
  password: string;
  location:
    | "Dhaka"
    | "Chattogram"
    | "Barishal"
    | "Rajshahi"
    | "Sylhet"
    | "Comilla"
    | "Rangpur"
    | "Mymensingh";
  breed:
    | "Brahman"
    | "Nellore"
    | "Sahiwal"
    | "Gir"
    | "Indigenous"
    | "Tharparkar"
    | "Kankrej";
  weight: number;
  label: "for sale" | "sold out";
  category: "Dairy" | "Beef" | "DualPurpose";
  seller: Types.ObjectId | IUser;
};

export type CowModel = {
  isUserExist(id: string): Promise<Pick<IUser, "id">>;
} & Model<ICow>;
