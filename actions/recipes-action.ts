"use server";
import { connectToDatabase } from "@/lib/db/connect";
import { CategoryModel } from "@/lib/db/models/category";
import { RecipeModel } from "@/lib/db/models/recipe";
import { UserModel } from "@/lib/db/models/user";
import { ViewModel } from "@/lib/db/models/view";
import { IRecipe, IRecipeUploadData } from "@/lib/types/auth-types";
import { cache } from "react";

export const fetchRecipes = cache(
  async (query: string, page: string): Promise<IRecipe[]> => {
    try {
      await connectToDatabase();
      if (query && page) {
        return await RecipeModel.find({
          title: { $regex: query, $options: "i" },
        })
          .skip((parseInt(page) - 1) * 10)
          .populate("createdBy", "name")
          .limit(10)
          .sort({ createdAt: -1 })
          .exec();
      }
      if (page) {
        return await RecipeModel.find({})
          .skip((parseInt(page) - 1) * 10)
          .populate("createdBy", "name")
          .limit(10)
          .sort({ createdAt: -1 })
          .exec();
      }
      const recipes = await RecipeModel.find({})
        .populate("createdBy", "name")
        .sort({ createdAt: -1 })
        .limit(10)
        .exec();
      return recipes;
    } catch (error) {
      console.error("Error fetching recipes:", error);
      throw new Error("Failed to fetch recipes");
    }
  }
);

export const getRecipeById = cache(async (id: string, userId: string) => {
  await connectToDatabase();

  const isUserViewedRecipeBefore = await ViewModel.findOne({
    userId,
    recipeId: id,
  }).exec();
  if (!isUserViewedRecipeBefore) {
    (await ViewModel.create({ userId, recipeId: id })).save();

    return await RecipeModel.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    ).exec();
  }
  const recipe = await RecipeModel.findById(id).exec();
  if (!recipe) {
    throw new Error("Recipe not found");
  }
  return recipe;
});

export const getAuthorName = cache(async (id: string) => {
  await connectToDatabase();
  const user = await UserModel.findById(id).exec();
  if (!user) {
    throw new Error("User not found");
  }
  return user.name;
});

export const getCategoryName = cache(async (id: string) => {
  await connectToDatabase();
  const category = await CategoryModel.findById(id).exec();
  if (!category) {
    throw new Error("Category not found");
  }
  return category.name;
});

export const getRecipesForLandingPage = cache(async () => {
  try {
    await connectToDatabase();
    const recipes = await RecipeModel.find({ isPublished: true })
      .sort({ likeCount: -1, views: -1 })
      .limit(3)
      .lean()
      .exec();

    return recipes.map((recipe: any) => ({
      ...recipe,
      _id: recipe._id.toString(),
      createdBy: recipe.createdBy?.toString?.() ?? recipe.createdBy,
      category: recipe.category?.toString?.() ?? recipe.category,
    })) as IRecipe[];
  } catch (error) {
    console.error("Error fetching recipes for landing page:", error);
  }
});

export async function uploadRecipe(recipeData: IRecipeUploadData) {
  try {
    const {
      title,
      createdBy,
      imageId,
      imageUrl,
      type,
      description,
      ingredients,
      instructions,
      category,
      cookingTime,
      serves,
      difficulty,
    } = recipeData;

    await connectToDatabase();

    const checkCategoryExist = await CategoryModel.findOne({
      slug: category.toLowerCase(),
    });

    if (!checkCategoryExist) {
      const categorys = await CategoryModel.create({
        name: category,
        slug: category.toLowerCase(),
      });

      await categorys.save();

      const recipe = await RecipeModel.create({
        title,
        createdBy,
        imageId,
        imageUrl,
        type,
        description,
        ingredients,
        instructions,
        category: categorys._id,
        cookingTime,
        serves,
        difficulty,
        isPublished: true,
      });

      await recipe.save();
      return { success: true };
    } else {
      const recipe = await RecipeModel.create({
        title,
        createdBy,
        imageId,
        imageUrl,
        type,
        description,
        ingredients,
        instructions,
        category: checkCategoryExist._id,
        cookingTime,
        serves,
        difficulty,
        isPublished: true,
      });

      await recipe.save();
      return { success: true };
    }
  } catch (error) {
    console.error("Error uploading recipe:", error);
    return { success: false };
  }
}

export const getAllRecipesCount = cache(async () => {
  try {
    await connectToDatabase();
    return await RecipeModel.countDocuments().exec();
  } catch (error) {
    console.error("Error fetching recipes for landing page:", error);
  }
});

export async function getSimilarRecipes(
  categoryId: string,
  currentRecipeId: string,
  limit: number = 6
) {
  try {
    await connectToDatabase();

    const similarRecipes = await RecipeModel.find({
      category: categoryId,
      _id: { $ne: currentRecipeId },
      isPublished: true,
    })
      .populate("createdBy", "name")
      .populate("category", "name")
      .select(
        "title imageUrl type description cookingTime difficulty likeCount views createdBy category createdAt"
      )
      .sort({ likeCount: -1, views: -1 })
      .limit(limit)
      .lean()
      .exec();
    return similarRecipes.map((recipe: any) => ({
      _id: recipe._id.toString(),
      title: recipe.title,
      imageUrl: recipe.imageUrl,
      type: recipe.type,
      description: recipe.description,
      cookingTime: recipe.cookingTime,
      difficulty: recipe.difficulty,
      likeCount: recipe.likeCount || 0,
      views: recipe.views || 0,
      createdBy: recipe.createdBy ? {
        _id: recipe.createdBy._id?.toString(),
        name: recipe.createdBy.name
      } : null,
      category: recipe.category ? {
        _id: recipe.category._id?.toString(),
        name: recipe.category.name
      } : null,
      createdAt: recipe.createdAt
    }));
  } catch (error) {
    console.error("Error fetching similar recipes:", error);
    return [];
  }
}
