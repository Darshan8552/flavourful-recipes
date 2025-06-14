"use server";
import { connectToDatabase } from "@/lib/db/connect";
import { RecipeModel } from "@/lib/db/models/recipe";
import { UserModel } from "@/lib/db/models/user";
import { IPopulatedRecipe } from "@/lib/types/recipe-types";

export interface FavoriteRecipesResult {
  recipes: IPopulatedRecipe[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export async function getUserFavoriteRecipes(
  userId: string,
  page: number = 1,
  limit: number = 12
): Promise<FavoriteRecipesResult> {
  try {
    await connectToDatabase();
    
    if (!userId) {
      throw new Error("User not found");
    }

    const user = await UserModel.findById(userId).select("favoriteRecipes").exec();

    if (!user) {
      throw new Error("User not found");
    }

    const favoriteRecipesIds = user.favoriteRecipes ?? [];
    if (!Array.isArray(favoriteRecipesIds) || favoriteRecipesIds.length === 0) {
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
    const totalCount = favoriteRecipesIds.length;
    const totalPages = Math.ceil(totalCount / limitNum);

    const paginatedIds = favoriteRecipesIds.slice(skip, skip + limitNum);

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
    console.error("Error getting favorite recipes:", error);
    throw new Error("Failed to fetch favorite recipes");
  }
}

export async function getUserFavoriteRecipesSimple(userId: string) {
  const result = await getUserFavoriteRecipes(userId, 1, 1000);
  return result.recipes;
}