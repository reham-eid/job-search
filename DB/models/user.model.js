import { Schema, model } from "mongoose";
import { roles, status } from "../../src/common/types/enum.js";

const userSchema = new Schema(
  {
    username: {
      firstName: { type: String, trim: true },
      lastName: { type: String, trim: true },
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    recoveryEmail: { type: String, trim: true },
    forgetCode: { type: String, trim: true },
    birthDate: Date,
    mobileNumber: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(roles),
      default: roles.user,
    },
    status: {
      type: String,
      enum: Object.values(status),
      default: status.offline,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isEmailConfirm: {
      type: Boolean,
      default: false,
    },
    changePassAt: Date,
  },
  { timestamps: true, strictQuery: true }
);
// virtual new field called jobs
userSchema.virtual("jobs", {
  ref: "job",
  localField: "_id",
  foreignField: "addedBy",
});
// virtual new field called companyId
userSchema.virtual("company", {
  ref: "company",
  localField: "_id",
  foreignField: "companyHR",
});
// virtual new field called applications
userSchema.virtual("applications", {
  ref: "application",
  localField: "_id",
  foreignField: "userId",
});

const User = model("user", userSchema);
export default User;
