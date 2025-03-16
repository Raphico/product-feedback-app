import mongoose from "mongoose";
import { Roles } from "../config.js";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: Object.values(Roles),
      default: Roles.USER,
    },
    emailVerificationCode: {
      type: String,
    },
    passwordResetToken: {
      type: String,
    },
    emailVerificationExpiry: {
      type: Date,
    },
    passwordResetExpiry: {
      type: Date,
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
