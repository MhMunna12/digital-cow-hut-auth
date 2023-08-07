import { paginationHelpers } from "../../../helpers/paginationHelpers";
import { IGenericResponses } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IUser } from "./user.interface";
import { User } from "./user.model";

const getAllUser = async (
  paginationOptions: IPaginationOptions
): Promise<IGenericResponses<IUser[]>> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);
  const result = await User.find().sort().skip(skip).limit(limit);
  const total = await User.countDocuments();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
const getSingleUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findById(id);
  return result;
};
const updateUser = async (
  id: string,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  const result = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};
const deleteUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findByIdAndDelete(id);
  return result;
};
export const UserService = {
  getAllUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
