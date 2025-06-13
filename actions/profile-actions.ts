"use server";

import { getSession } from "@/lib/auth/auth";
import { connectToDatabase } from "@/lib/db/connect";
import { UserModel } from "@/lib/db/models/user";
import { FormState } from "@/lib/types/auth-types";
import { hash, verify } from "argon2";
import { clearAuthCookies } from "@/actions/auth-action";

export async function getProfileImage(id: string) {
  try {
    await connectToDatabase();
    const profile = await UserModel.findById(id).select("-password").exec();
    if (!profile) return null;
    return profile;
  } catch (error) {
    console.error(error);
  }
}

export async function changePassword(state: FormState, formData: FormData) {
  try {
    const oldPassword = formData.get("old-password") as string;
    const newPassword = formData.get("new-password") as string;
    const confirmPassword = formData.get("new-confirm-password") as string;

    console.log(oldPassword, newPassword, confirmPassword);

    if (!oldPassword || !newPassword || !confirmPassword) {
      return {
        errors: {
          oldPassword: !oldPassword ? ["Old password is required"] : [],
          newPassword: !newPassword ? ["New password is required"] : [],
          confirmPassword: !confirmPassword
            ? ["Confirm password is required"]
            : [],
        },
      };
    }

    if (newPassword !== confirmPassword) {
      return {
        errors: {
          newPassword: ["New password and confirm password do not match"],
        },
      };
    }

    await connectToDatabase();

    const session = await getSession();

    if (!session) {
      return {
        errors: {
          message: ["Please sign in to change your password"],
        },
      };
    }
    console.log(session);

    const user = await UserModel.findById(session.user.id)
      .select("password")
      .exec();

    if (!user) {
      return {
        errors: {
          message: ["User not found"],
        },
      };
    }
    console.log(user.password);

    const isValidPassword = await verify(user.password!, oldPassword);

    if (!isValidPassword) {
      return {
        errors: {
          oldPassword: ["Old password is incorrect"],
        },
      };
    }

    const hashedPassword = await hash(newPassword);

    await UserModel.findByIdAndUpdate(
      session.user.id,
      { password: hashedPassword },
      { new: true }
    ).exec();

    return {
      success: true,
      message: "Password changed successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      errors: {
        message: ["An error occurred while changing password"],
      },
    };
  }
}

export async function deleteAccount(id: string) {
  try {
    await connectToDatabase();
    const user = await UserModel.findByIdAndDelete(id).exec();
    if (!user) return null;
    await clearAuthCookies();
    return { success: true };
  } catch (error) {
    console.error(error);
  }
}
