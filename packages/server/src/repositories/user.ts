import type { UserRepository } from "./user.interface.js";
import type { UserEntity } from "../models/user.js";
import type { RootFilterQuery, UpdateQuery } from "mongoose";
import { User } from "../models/user.js";

export const userRepository: UserRepository = {
  async create(user: {
    fullName: string;
    username: string;
    email: string;
    password: string;
    emailVerificationCode: string;
    emailVerificationExpiry: Date;
  }): Promise<UserEntity> {
    return User.create(user);
  },
  async findById(id: string): Promise<UserEntity | null> {
    const user = await User.findOne({ _id: id });
    if (!user) return null;
    return user;
  },
  async findOne(
    filter: RootFilterQuery<UserEntity>,
  ): Promise<UserEntity | null> {
    const user = await User.findOne(filter);
    if (!user) return null;
    return user;
  },
  async findByEmailOrUsername({
    email,
    username,
  }: {
    email: string;
    username?: string;
  }): Promise<UserEntity | null> {
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (!user) return null;
    return user;
  },
  async update(
    id: string,
    data: UpdateQuery<UserEntity>,
  ): Promise<UserEntity | null> {
    return User.findOneAndUpdate({ _id: id }, data, { new: true });
  },
};
