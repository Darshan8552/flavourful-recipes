"use server";

import { revalidatePath } from "next/cache";
import mongoose, { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db/connect";
import { RecipeModel } from "@/lib/db/models/recipe";
import { UserModel } from "@/lib/db/models/user";

export async function toggleLike(recipeId: string, userId: string) {
  try {
    await connectToDatabase();

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const recipe = await RecipeModel.findById(recipeId).session(session);
      const user = await UserModel.findById(userId).session(session);

      if (!recipe) {
        throw new Error("Recipe not found");
      }

      if (!user) {
        throw new Error("User not found");
      }

      const userLikeIndex = recipe?.likes?.findIndex(
        (like: any) => like.toString() === userId
      );

      const userFavoriteIndex = user?.favoriteRecipes?.findIndex(
        (favorite: any) => favorite.toString() === recipeId
      );

      let isLiked: boolean;
      let likeCount: number;

      if (userLikeIndex! > -1) {
        recipe?.likes?.splice(userLikeIndex!, 1);
        recipe.likeCount = Math.max(0, recipe.likeCount! - 1);

        if (userFavoriteIndex! > -1) {
          user.favoriteRecipes!.splice(userFavoriteIndex!, 1);
        }

        isLiked = false;
      } else {
        recipe.likes!.push(new Types.ObjectId(userId));
        recipe.likeCount! += 1;

        if (userFavoriteIndex === -1) {
          user.favoriteRecipes!.push(new Types.ObjectId(recipeId));
        }

        isLiked = true;
      }

      likeCount = recipe.likeCount || 0;

      await recipe.save({ session });
      await user.save({ session });

      await session.commitTransaction();

      revalidatePath(`/recipes/${recipeId}`);

      return {
        success: true,
        likeCount,
        isLiked,
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    throw new Error("Failed to toggle like");
  }
}

export async function toggleSave(recipeId: string, userId: string) {
  try {
    await connectToDatabase();

    const user = await UserModel.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const userSavedIndex = user.savedRecipes!.findIndex(
      (saved: any) => saved.toString() === recipeId
    );

    let isSaved: boolean;

    if (userSavedIndex > -1) {
      user.savedRecipes!.splice(userSavedIndex, 1);
      isSaved = false;
    } else {
      user.savedRecipes!.push(new Types.ObjectId(recipeId));
      isSaved = true;
    }

    await user.save();

    revalidatePath(`/recipes/${recipeId}`);

    return {
      success: true,
      isSaved,
    };
  } catch (error) {
    console.error("Error toggling save:", error);
    throw new Error("Failed to toggle save");
  }
}

export async function findById(id: string) {
  try {
    await connectToDatabase();
    const profile = await UserModel.findById(id).select("-password").exec();
    if (!profile) return null;
    return profile;
  } catch (error) {
    console.error(error);
  }
}
