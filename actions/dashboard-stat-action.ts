"use server";
import { connectToDatabase } from "@/lib/db/connect";
import { RecipeModel } from "@/lib/db/models/recipe";
import { UserModel } from "@/lib/db/models/user";
import { CommentModel } from "@/lib/db/models/comment";
import { ViewModel } from "@/lib/db/models/view";

export async function getUserStatsAction() {
  try {
    await connectToDatabase();

    const [totalUsers, adminUsers, verifiedUsers, unverifiedUsers] =
      await Promise.all([
        UserModel.countDocuments(),
        UserModel.countDocuments({ role: "admin" }),
        UserModel.countDocuments({ emailVerified: true }),
        UserModel.countDocuments({ emailVerified: false }),
      ]);

    return {
      totalUsers,
      adminUsers,
      regularUsers: totalUsers - adminUsers,
      verifiedUsers,
      unverifiedUsers,
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw new Error("Failed to fetch user statistics");
  }
}

export async function getRecipeStats() {
  try {
    await connectToDatabase();

    const totalRecipes = await RecipeModel.countDocuments();
    const publishedRecipes = await RecipeModel.countDocuments({
      isPublished: true,
    });
    const draftRecipes = await RecipeModel.countDocuments({
      isPublished: false,
    });

    const vegRecipes = await RecipeModel.countDocuments({
      type: "veg",
      isPublished: true,
    });
    const nonVegRecipes = await RecipeModel.countDocuments({
      type: "non-veg",
      isPublished: true,
    });

    const easyRecipes = await RecipeModel.countDocuments({
      difficulty: "easy",
      isPublished: true,
    });
    const mediumRecipes = await RecipeModel.countDocuments({
      difficulty: "medium",
      isPublished: true,
    });
    const hardRecipes = await RecipeModel.countDocuments({
      difficulty: "hard",
      isPublished: true,
    });

    return {
      total: totalRecipes,
      published: publishedRecipes,
      drafts: draftRecipes,
      byType: {
        veg: vegRecipes,
        nonVeg: nonVegRecipes,
      },
      byDifficulty: {
        easy: easyRecipes,
        medium: mediumRecipes,
        hard: hardRecipes,
      },
    };
  } catch (error) {
    console.error("Error fetching recipe stats:", error);
    return {
      total: 0,
      published: 0,
      drafts: 0,
      byType: { veg: 0, nonVeg: 0 },
      byDifficulty: { easy: 0, medium: 0, hard: 0 },
    };
  }
}

export async function getEngagementStats() {
  try {
    await connectToDatabase();

    const [totalComments, totalViews, totalLikes] = await Promise.all([
      CommentModel.countDocuments(),
      ViewModel.countDocuments(),
      RecipeModel.aggregate([
        { $group: { _id: null, totalLikes: { $sum: "$likeCount" } } },
      ]),
    ]);

    return {
      totalComments,
      totalViews,
      totalLikes: totalLikes[0]?.totalLikes || 0,
    };
  } catch (error) {
    console.error("Error fetching engagement stats:", error);
    return { totalComments: 0, totalViews: 0, totalLikes: 0 };
  }
}

export async function getMonthlyGrowthStats() {
  try {
    await connectToDatabase();

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [userGrowth, recipeGrowth] = await Promise.all([
      UserModel.aggregate([
        {
          $match: { createdAt: { $gte: sixMonthsAgo } },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
      RecipeModel.aggregate([
        {
          $match: { createdAt: { $gte: sixMonthsAgo }, isPublished: true },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
    ]);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const formatGrowthData = (data: any[]) => {
      return data.map((item) => ({
        month: `${months[item._id.month - 1]} ${item._id.year}`,
        count: item.count,
      }));
    };

    return {
      userGrowth: formatGrowthData(userGrowth),
      recipeGrowth: formatGrowthData(recipeGrowth),
    };
  } catch (error) {
    console.error("Error fetching growth stats:", error);
    return { userGrowth: [], recipeGrowth: [] };
  }
}

export async function getTopRecipes() {
  try {
    await connectToDatabase();

    const topRecipes = await RecipeModel.find({ isPublished: true })
      .sort({ likeCount: -1, views: -1 })
      .limit(5)
      .select("title likeCount views")
      .lean();

    return topRecipes.map((recipe) => ({
      id: recipe._id.toString(),
      title: recipe.title,
      likes: recipe.likeCount,
      views: recipe.views,
    }));
  } catch (error) {
    console.error("Error fetching top recipes:", error);
    return [];
  }
}
