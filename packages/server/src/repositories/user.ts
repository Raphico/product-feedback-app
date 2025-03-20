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
  async findByField<K extends keyof UserDto>(
    field: K,
    value: UserDto[K],
  ): Promise<UserDto | null> {
    const user = await User.findOne({ [field]: value }).lean();

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
