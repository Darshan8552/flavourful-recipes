"use server";

import { connectToDatabase } from "@/lib/db/connect";
import { CategoryModel } from "@/lib/db/models/category";
import { RecipeModel } from "@/lib/db/models/recipe";

interface CategorySearchParams {
  search?: string;
  page?: string;
}

interface CategoryWithRecipeCount {
  _id: string;
  name: string;
  slug: string;
  recipeCount: number;
}

export async function getAllCategoriesWithPagination(
  searchParams: CategorySearchParams
) {
  try {
    await connectToDatabase();

    const { search = "", page = "1" } = searchParams;

    let query: any = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const pageNumber = parseInt(page) || 1;
    const limit = 12;
    const skip = (pageNumber - 1) * limit;

    const totalCategories = await CategoryModel.countDocuments(query);
    const totalPages = Math.ceil(totalCategories / limit);
    const hasNextPage = pageNumber < totalPages;
    const hasPrevPage = pageNumber > 1;

    const categories = await CategoryModel.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .lean();
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const recipeCount = await RecipeModel.countDocuments({
          category: category._id,
          isPublished: true,
        });

        return {
          _id: category._id.toString(),
          name: category.name,
          slug: category.slug,
          recipeCount,
        };
      })
    );

    return {
      categories: categoriesWithCount,
      totalCount: totalCategories,
      currentPage: pageNumber,
      totalPages,
      hasNextPage,
      hasPrevPage,
      limit,
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      categories: [],
      totalCount: 0,
      currentPage: 1,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
      limit: 12,
    };
  }
}
