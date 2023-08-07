import { Schema, model } from "mongoose";
import { CowModel, ICow, label } from "./cow.interface";
import { User } from "../user/user.model";
import { IUser } from "../user/user.interface";
import ApiError from "../../../errors/ApiError";

const CowSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    location: {
      type: String,
      required: true,
      enum: [
        "Dhaka",
        "Chattogram",
        "Barishal",
        "Rajshahi",
        "Sylhet",
        "Comilla",
        "Rangpur",
        "Mymensingh",
      ],
    },
    breed: {
      type: String,
      required: true,
      enum: [
        "Brahman",
        "Nellore",
        "Sahiwal",
        "Gir",
        "Indigenous",
        "Tharparkar",
        "Kankrej",
      ],
    },
    weight: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
      enum: label,
      default: "for sale",
    },
    category: {
      type: String,
      required: true,
      enum: ["Dairy", "Beef", "DualPurpose"],
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
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

CowSchema.statics.isUserExist = async function (
  id: string
): Promise<Pick<IUser, "id"> | null> {
  const data = await User.findOne({ _id: id }, { id: 1, role: 1 });
  return data;
};

CowSchema.pre("save", async function (next) {
  next();
});

export const Cow = model<ICow, CowModel>("Cow", CowSchema);
