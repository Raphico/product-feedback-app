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
      default: null,
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
    emailVerificationExpiry: {
      type: Date,
      default: null,
    },
    passwordResetExpiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
