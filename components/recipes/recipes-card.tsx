import { Clock, Eye, Heart, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IPopulatedRecipe } from "@/lib/types/recipe-types";

interface RecipeCardProps {
  recipe: IPopulatedRecipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <Link href={`/recipes/${recipe._id}`} className="group cursor-pointer">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 dark:border-zinc-700 hover:-translate-y-1">
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
                  ? "bg-green-600 dark:bg-green-500 text-white"
                  : "bg-orange-500 dark:bg-orange-500 text-white"
              }`}
            >
              {recipe.type === "veg" ? "Veg" : "Non-Veg"}
            </span>
          </div>
          {recipe.category && (
            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-sky-500 dark:bg-sky-400 text-white">
                {recipe.category.name}
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3
            className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors cursor-pointer text-gray-900 dark:text-zinc-100"
            title={recipe.title}
          >
            {recipe.title}
          </h3>

          <p className="text-sm text-gray-600 dark:text-zinc-400 mb-3 line-clamp-2">
            {recipe.description}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-zinc-400 mb-3">
            <span>By {recipe.createdBy?.name || "Unknown"}</span>
            <span className="capitalize bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 px-2 py-1 rounded">
              {recipe.difficulty}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-zinc-400">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{recipe.cookingTime}m</span>
            </div>

            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{recipe.serves}</span>
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
  );
};

export default RecipeCard;