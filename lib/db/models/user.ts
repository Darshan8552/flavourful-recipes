import { IUser } from "@/lib/types/auth-types";
import mongoose, { Model, Schema } from "mongoose";

const UserSchema = new Schema<IUser>(
  {
    name: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      select: false,
    },
    image: {
      type: String,
      default:
        "https://ik.imagekit.io/4kojujvb7/profileIcon1_3FPZFYj27V?updatedAt=1745381581156",
    },
    imageId: {
      type: String,
      default: "680868cc432c476416d53e56",
    },
    provider: {
      type: String,
      required: true,
      default: "credentials",
    },
    providerId: String,
    favoriteRecipes: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
    savedRecipes: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    emailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
