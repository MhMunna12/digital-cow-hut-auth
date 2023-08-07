import { Schema, model } from "mongoose";
import { IUser, UserModel } from "./user.interface";
import bcrypt from "bcrypt";
import config from "../../../config";
const userSchema = new Schema<IUser, UserModel>(
  {
    // id: {
    //   type: String,
    //   required: true,
    // },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
    },
    address: {
      type: String,
      required: true,
    },
    budget: {
      type: String,
      required: true,
    },
    income: {
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

userSchema.statics.isUserExit = async function (
  phoneNumber: string
): Promise<Pick<IUser, "phoneNumber" | "role" | "password"> | null> {
  return await User.findOne(
    { phoneNumber },
    { id: 1, phoneNumber: 1, role: 1, password: 1 }
  );
};
userSchema.statics.isPasswordMatch = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

userSchema.statics.hashPassword = async function (
  givenPassword: string
): Promise<{ password: string }> {
  const hashedPassword = await bcrypt.hash(
    givenPassword,
    Number(config.bcrypt_salt_rounds)
  );
  return { password: hashedPassword };
};

userSchema.pre("save", async function (next) {
  //hashing user password
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds)
  );

  next();
});
export const User = model<IUser, UserModel>("User", userSchema);
