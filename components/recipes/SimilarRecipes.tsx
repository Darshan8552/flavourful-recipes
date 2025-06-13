// components/recipes/SimilarRecipes.tsx
import { getSimilarRecipes } from "@/actions/recipes-action";
import Image from "next/image";
import Link from "next/link";
import { Clock, Eye, Heart } from "lucide-react";

interface SimilarRecipesProps {
  categoryId: string;
  currentRecipeId: string;
  categoryName: string;
}

export default async function SimilarRecipes({
  categoryId,
  currentRecipeId,
  categoryName,
}: SimilarRecipesProps) {
  const similarRecipes = await getSimilarRecipes(
    categoryId,
    currentRecipeId,
    5
  );
  if (!similarRecipes || similarRecipes.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 w-full">
      <h2 className="text-2xl font-semibold mb-6">
        More {categoryName} Recipes
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {similarRecipes.map((recipe: any) => (
          <Link
            href={`/recipes/${recipe._id}`}
            key={recipe._id}
            className="group cursor-pointer"
          >
            <div className="bg-white dark:bg-black rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border dark:border-gray-800">
              <div className="relative w-full h-48">
                <Image
                  src={recipe.imageUrl || "/placeholder.svg"}
                  alt={recipe.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      recipe.type === "veg"
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {recipe.type === "veg" ? "Veg" : "Non-Veg"}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3
                  className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer"
                  title={recipe.title}
                >
                  {recipe.title}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {recipe.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <span>By {recipe.createdBy?.name || "Unknown"}</span>
                  <span className="capitalize">{recipe.difficulty}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{recipe.cookingTime}m</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{recipe.likeCount || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{recipe.views || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link
          href={`/recipes?category=${categoryId}`}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        >
          View All {categoryName} Recipes →
        </Link>
      </div>
    </div>
  );
}
