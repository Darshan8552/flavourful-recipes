"use server";

import { connectToDatabase } from "@/lib/db/connect";
import { RecipeModel } from "@/lib/db/models/recipe";
import { CategoryModel } from "@/lib/db/models/category";

interface SearchParams {
  search?: string;
  category?: string;
  status?: string;
  page?: string;
}

interface PopulatedCategory {
  _id: string;
  name: string;
}

interface PopulatedRecipe {
  _id: any;
  title: string;
  description: string;
  imageUrl?: string;
  createdBy?: PopulatedUser;
  category?: PopulatedCategory;
  isPublished: boolean;
  views?: number;
  likeCount?: number;
  cookingTime?: number;
  difficulty?: string;
  createdAt: Date;
}

interface PopulatedUser {
  _id: string;
  name: string;
  email: string;
}

export async function fetchRecipesForAdmin(searchParams: SearchParams) {
  try {
    await connectToDatabase();

    const {
      search = "",
      category = "all",
      status = "all",
      page = "1",
    } = searchParams;

    let query: any = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category !== "all") {
      const categoryDoc = await CategoryModel.findOne({
        slug: category.toLowerCase(),
      });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      }
    }

    if (status !== "all") {
      query.isPublished = status === "published";
    }

    const pageNumber = parseInt(page) || 1;
    const limit = 10;
    const skip = (pageNumber - 1) * limit;

    const totalRecipes = await RecipeModel.countDocuments(query);
    const totalPages = Math.ceil(totalRecipes / limit);
    const hasNextPage = pageNumber < totalPages;
    const hasPrevPage = pageNumber > 1;

    const recipes = await RecipeModel.find(query)
      .populate("createdBy", "name email")
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean() as PopulatedRecipe[];

    const serializedRecipes = recipes.map((recipe) => ({
      _id: recipe._id.toString(),
      title: recipe.title,
      description: recipe.description,
      imageUrl: recipe.imageUrl || "",
      createdBy: recipe.createdBy ? {
        _id: recipe.createdBy._id.toString(),
        name: recipe.createdBy.name,
        email: recipe.createdBy.email,
      } : {
        _id: undefined,
        name: undefined,
        email: undefined,
      },
      category: recipe.category ? {
        _id: recipe.category._id.toString(),
        name: recipe.category.name,
      } : {
        _id: "",
        name: "Uncategorized",
      },
      isPublished: recipe.isPublished,
      views: recipe.views || 0,
      likeCount: recipe.likeCount || 0,
      cookingTime: recipe.cookingTime || 0,
      difficulty: recipe.difficulty || "medium",
      createdAt: recipe.createdAt.toISOString(),
    }));

    return {
      recipes: serializedRecipes,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalRecipes,
        hasNextPage,
        hasPrevPage,
        limit,
      },
    };
  } catch (error) {
    console.error("Error fetching recipes for admin:", error);
    throw new Error("Failed to fetch recipes");
  }
}

export async function getAllCategories() {
  try {
    await connectToDatabase();
    const categories = await CategoryModel.find({})
      .select("name slug")
      .sort({ name: 1 })
      .lean();

    const serializedCategories = categories.map((category) => ({
      _id: category._id.toString(),
      name: category.name,
      slug: category.slug,
    }));

    return serializedCategories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function updateRecipeStatus(
  recipeId: string,
  isPublished: boolean
) {
  try {
    await connectToDatabase();

    const updatedRecipe = await RecipeModel.findByIdAndUpdate(
      recipeId,
      { isPublished },
      { new: true }
    );

    if (!updatedRecipe) {
      throw new Error("Recipe not found");
    }

    return { success: true, recipe: updatedRecipe };
  } catch (error) {
    console.error("Error updating recipe status:", error);
    return { success: false, error: "Failed to update recipe status" };
  }
}

export async function deleteRecipe(recipeId: string) {
  try {
    await connectToDatabase();

    const deletedRecipe = await RecipeModel.findByIdAndDelete(recipeId);

    if (!deletedRecipe) {
      throw new Error("Recipe not found");
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return { success: false, error: "Failed to delete recipe" };
  }
}