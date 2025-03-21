import type { CreateUserDto, UserDto } from "../dtos/user.js";
import { User } from "../models/user.js";

export type UserRepository = typeof userRepository;

export const userRepository = {
  async create(user: CreateUserDto): Promise<UserDto> {
    const createdUser = await User.create(user);
    return {
      ...createdUser.toObject(),
      id: createdUser._id.toString(),
    };
  },
  async findById(id: string): Promise<UserDto | null> {
    const user = await User.findOne({ _id: id }).lean();

    if (!user) return null;

    return {
      ...user,
      id: user._id.toString(),
    };
  },
  async findOne(filter: Partial<Omit<UserDto, "id">>): Promise<UserDto | null> {
    const user = await User.findOne(filter).lean();

    if (!user) return null;

    return {
      ...user,
      id: user._id.toString(),
    };
  },
  async findByEmailOrUsername({
    email,
    username,
  }: {
    email: string;
    username?: string;
  }): Promise<UserDto | null> {
    const user = await User.findOne({ $or: [{ email }, { username }] }).lean();

    if (!user) return null;

    return {
      ...user,
      id: user._id.toString(),
    };
  },
  async update(id: string, data: Partial<UserDto>): Promise<UserDto | null> {
    return User.findOneAndUpdate({ _id: id }, data, { new: true });
  },
};
