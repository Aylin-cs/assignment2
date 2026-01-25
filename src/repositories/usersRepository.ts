import UserModel, { IUser } from "../models/usersModel";
import { Document } from "mongoose";

interface UserData {
  username: string;
  email: string;
  password: string;
}

export const addUser = async (
  userData: UserData
): Promise<Document<unknown, any, IUser>> => {
  const user = new UserModel(userData);
  return await user.save();
};

export const getAllUsers = async (
  filter: Record<string, unknown> = {}
): Promise<IUser[]> => {
  return await UserModel.find(filter);
};

export const getUserById = async (id: string): Promise<IUser | null> => {
  return await UserModel.findById(id);
};

export const updateUser = async (
  id: string,
  data: Partial<IUser>
): Promise<IUser | null> => {
  return await UserModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

export const deleteUser = async (id: string): Promise<void> => {
  await UserModel.findByIdAndDelete(id);
};

const saveUser = async (user: IUser) => {
  return await user.save();
};

export const findByEmail = async (email: string): Promise<IUser | null> => {
  return await UserModel.findOne({ email });
};

export const findByUsername = async (
  username: string
): Promise<IUser | null> => {
  return await UserModel.findOne({ username });
};

export default {
  addUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  findByEmail,
  findByUsername,
  saveUser,
};