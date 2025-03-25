import type { RootFilterQuery, UpdateQuery } from "mongoose";
import type { UserEntity } from "../models/user.js";

export interface UserRepository {
  create(user: {
    fullName: string;
    username: string;
    email: string;
    password: string;
    emailVerificationCode: string;
    emailVerificationExpiry: Date;
  }): Promise<UserEntity>;
  findById(id: string): Promise<UserEntity | null>;
  findOne(filter: RootFilterQuery<UserEntity>): Promise<UserEntity | null>;
  findByEmailOrUsername({
    email,
    username,
  }: {
    email: string;
    username: string;
  }): Promise<UserEntity | null>;
  update(id: string, data: UpdateQuery<UserEntity>): Promise<UserEntity | null>;
}
