'use server';

import { connectToDatabase } from "@/lib/db/connect";
import { CategoryModel } from "@/lib/db/models/category";
import { RecipeModel } from "@/lib/db/models/recipe";
import { IRecipe } from "@/lib/types/auth-types";
import { IPopulatedRecipe } from "@/lib/types/recipe-types";

export interface RecipeFilters {
  query?: string;
  type?: string;
  category?: string;
  difficulty?: string;
  cookingTime?: string;
  serves?: string;
  sortBy?: string;
  page?: string;
  limit?: string;
}

export interface RecipeSearchResult {
  recipes: IPopulatedRecipe[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export async function fetchRecipesWithFilters(
  filters: RecipeFilters = {}
): Promise<RecipeSearchResult> {
  try {
    await connectToDatabase();

    const {
      query = "",
      type = "",
      category = "",
      difficulty = "",
      cookingTime = "",
      serves = "",
      sortBy = "",
      page = "1",
      limit = "12",
    } = filters;

    const searchQuery: any = { isPublished: true };

    if (query.trim()) {
      searchQuery.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { ingredients: { $elemMatch: { $regex: query, $options: "i" } } },
      ];
    }

    if (type) {
      const types = type.split(",").filter(Boolean);
      if (types.length > 0) {
        searchQuery.type = { $in: types };
      }
    }

    if (category) {
      searchQuery.category = category;
    }

    if (difficulty) {
      searchQuery.difficulty = difficulty;
    }

    if (cookingTime) {
      const timeValue = parseInt(cookingTime);
      if (timeValue === 180) {
        searchQuery.cookingTime = { $gte: 180 };
      } else {
        searchQuery.cookingTime = { $lte: timeValue };
      }
    }

    if (serves) {
      const servesValue = parseInt(serves);
      if (servesValue === 5) {
        searchQuery.serves = { $gte: servesValue };
      } else {
        searchQuery.serves = servesValue;
      }
    }

    let sortOptions: any = { createdAt: -1 };

    switch (sortBy) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "most-liked":
        sortOptions = { likeCount: -1, createdAt: -1 };
        break;
      case "most-viewed":
        sortOptions = { views: -1, createdAt: -1 };
        break;
      case "cooking-time-asc":
        sortOptions = { cookingTime: 1, createdAt: -1 };
        break;
      case "cooking-time-desc":
        sortOptions = { cookingTime: -1, createdAt: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const currentPage = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, Math.min(50, parseInt(limit)));
    const skip = (currentPage - 1) * limitNum;

    const [recipes, totalCount] = await Promise.all([
      RecipeModel.find(searchQuery)
        .populate("createdBy", "name image")
        .populate("category", "name slug")
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      RecipeModel.countDocuments(searchQuery),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);
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
    console.error("Error fetching recipes with filters:", error);
    throw new Error("Failed to fetch recipes");
  }
}

export async function getCategories() {
  try {
    await connectToDatabase();

    const categories = await CategoryModel.find({}).sort({ name: 1 }).lean();

     const serializedCategories = categories.map(category => ({
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

export async function searchRecipeSuggestions(query: string, limit: number = 5) {
  try {
    await connectToDatabase();

    if (!query.trim()) return [];

    const suggestions = await RecipeModel.find({
      isPublished: true,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    })
      .select("title description")
      .limit(limit)
      .lean();

    return suggestions.map((recipe) => ({
      id: recipe._id,
      title: recipe.title,
      description: recipe.description,
    }));
  } catch (error) {
    console.error("Error fetching recipe suggestions:", error);
    return [];
  }
}

export async function getRecipeStats() {
  try {
    await connectToDatabase();

    const [
      totalRecipes,
      publishedRecipes,
      vegRecipes,
      nonVegRecipes,
      easyRecipes,
      mediumRecipes,
      hardRecipes,
    ] = await Promise.all([
      RecipeModel.countDocuments({}),
      RecipeModel.countDocuments({ isPublished: true }),
      RecipeModel.countDocuments({ type: "veg", isPublished: true }),
      RecipeModel.countDocuments({ type: "non-veg", isPublished: true }),
      RecipeModel.countDocuments({ difficulty: "easy", isPublished: true }),
      RecipeModel.countDocuments({ difficulty: "medium", isPublished: true }),
      RecipeModel.countDocuments({ difficulty: "hard", isPublished: true }),
    ]);

    return {
      totalRecipes,
      publishedRecipes,
      typeStats: {
        veg: vegRecipes,
        nonVeg: nonVegRecipes,
      },
      difficultyStats: {
        easy: easyRecipes,
        medium: mediumRecipes,
        hard: hardRecipes,
      },
    };
  } catch (error) {
    console.error("Error fetching recipe stats:", error);
    return null;
  }
}

export async function getPopularRecipes(limit: number = 6) {
  try {
    await connectToDatabase();

    const popularRecipes = await RecipeModel.find({ isPublished: true })
      .populate("createdBy", "name image")
      .populate("category", "name slug")
      .sort({ likeCount: -1, views: -1, createdAt: -1 })
      .limit(limit)
      .lean();

    return popularRecipes as IRecipe[];
  } catch (error) {
    console.error("Error fetching popular recipes:", error);
    return [];
  }
}

export async function getRecentRecipes(limit: number = 6) {
  try {
    await connectToDatabase();

    const recentRecipes = await RecipeModel.find({ isPublished: true })
      .populate("createdBy", "name image")
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return recentRecipes as IRecipe[];
  } catch (error) {
    console.error("Error fetching recent recipes:", error);
    return [];
  }
}

export async function fetchRecipes(query: string = "", page: string = "1") {
  const result = await fetchRecipesWithFilters({ query, page });
  return result.recipes;
}

export async function getAllRecipesCount() {
  try {
    await connectToDatabase();
    return await RecipeModel.countDocuments({ isPublished: true });
  } catch (error) {
    console.error("Error getting recipe count:", error);
    return 0;
  }
}