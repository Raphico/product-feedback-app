import { User } from "../models/user.js";
import type { ExtractModelType } from "../types.js";
import type { SignupRequestSchema } from "../validations/auth.js";
import type { Types, FilterQuery } from "mongoose";

type UserModel = ExtractModelType<typeof User>;

export type UserRepository = typeof userRepository;

export const userRepository = {
  async create(
    user: SignupRequestSchema & {
      emailVerificationCode: string;
      emailVerificationExpiry: Date;
    },
  ) {
    return User.create(user);
  },
  async findByEmailOrUsername({
    email,
    username,
  }: {
    email: string;
    username?: string;
  }) {
    const query: FilterQuery<UserModel>[] = [{ email }];
    if (username) query.push({ username });

    return User.findOne({ $or: query });
  },
  async update(_id: Types.ObjectId, data: Partial<UserModel>) {
    return User.findOneAndUpdate({ _id }, data, { new: true });
  },
};
