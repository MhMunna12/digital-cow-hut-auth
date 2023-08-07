import { Schema, model } from "mongoose";

import bcrypt from "bcrypt";
import ApiError from "../../../errors/ApiError";
import { AdminModel, IAdmin, role } from "./admin.interface";
import config from "../../../config";

const AdminSchema = new Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      // unique: true,
    },
    role: {
      type: String,
      enum: role,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: {
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
      },
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);
AdminSchema.statics.isAdminExist = async function (
  phoneNumber: string
): Promise<Pick<IAdmin, "phoneNumber" | "password" | "role"> | null> {
  return await Admin.findOne(
    { phoneNumber },
    { id: 1, password: 1, role: 1, phoneNumber: 1 }
  );
};

AdminSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};
AdminSchema.statics.hashPassword = async function (
  givenPassword: string
): Promise<{ password: string }> {
  const hashedPassword = await bcrypt.hash(
    givenPassword,
    Number(config.bcrypt_salt_rounds)
  );
  return { password: hashedPassword };
};

AdminSchema.pre("save", async function (next) {
  //hash the password
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

export const Admin = model<IAdmin, AdminModel>("Admin", AdminSchema);
