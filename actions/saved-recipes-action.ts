"use server";
import { connectToDatabase } from "@/lib/db/connect";
import { RecipeModel } from "@/lib/db/models/recipe";
import { UserModel } from "@/lib/db/models/user";
import { IPopulatedRecipe } from "@/lib/types/recipe-types";

export interface SavedRecipesResult {
  recipes: IPopulatedRecipe[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export async function getUserSavedRecipes(
  userId: string,
  page: number = 1,
  limit: number = 12
): Promise<SavedRecipesResult> {
  try {
    await connectToDatabase();
    
    if (!userId) {
      throw new Error("User not found");
    }

    const user = await UserModel.findById(userId).select("savedRecipes").exec();

    if (!user) {
      throw new Error("User not found");
    }

    const savedRecipesIds = user.savedRecipes ?? [];
    if (!Array.isArray(savedRecipesIds) || savedRecipesIds.length === 0) {
      return {
        recipes: [],
        totalCount: 0,
        currentPage: 1,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      };
    }

    const currentPage = Math.max(1, page);
    const limitNum = Math.max(1, Math.min(50, limit));
    const skip = (currentPage - 1) * limitNum;
    const totalCount = savedRecipesIds.length;
    const totalPages = Math.ceil(totalCount / limitNum);

    const paginatedIds = savedRecipesIds.slice(skip, skip + limitNum);

    const recipes = await RecipeModel.find({
      _id: { $in: paginatedIds },
      isPublished: true,
    })
    .populate("createdBy", "name image")
    .populate("category", "name slug")
    .sort({ createdAt: -1 })
    .lean();

    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;

    return {
      recipes: recipes as IPopulatedRecipe[],
      totalCount,
      currentPage,
      totalPages,
      hasNextPage,
      hasPrevPage,
    };
  } catch (error) {
    console.error("Error getting saved recipes:", error);
    throw new Error("Failed to fetch saved recipes");
  }
}

export async function getUserSavedRecipesSimple(userId: string) {
  const result = await getUserSavedRecipes(userId, 1, 1000);
  return result.recipes;
}