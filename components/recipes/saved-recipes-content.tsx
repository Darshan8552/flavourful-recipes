import { getUserSavedRecipes } from '@/actions/saved-recipes-action';
import RecipeCard from '@/components/recipes/recipes-card';
import Pagination from '@/components/recipes/pagination';
import { Bookmark, Heart } from 'lucide-react';
import React from 'react';

interface SavedRecipesContentProps {
  userId: string;
  currentPage: number;
}

const SavedRecipesContent: React.FC<SavedRecipesContentProps> = async ({
  userId,
  currentPage,
}) => {
  const recipesData = await getUserSavedRecipes(userId, currentPage, 12);

  if (recipesData.totalCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-64 text-center">
        <div className="bg-gray-200 dark:bg-zinc-800 rounded-full p-6 mb-4">
          <Bookmark className="w-12 h-12 text-gray-600 dark:text-zinc-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-zinc-100 mb-2">
          No Saved Recipes Yet
        </h2>
        <p className="text-gray-600 dark:text-zinc-400 mb-4 max-w-md">
          Start exploring our recipes and save the ones you love by clicking the bookmark icon.
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-400">
          <Heart className="w-4 h-4" />
          <span>Browse recipes to build your collection</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <p className="text-gray-600 dark:text-zinc-400 text-sm">
            {recipesData.totalCount > 0
              ? `Showing ${recipesData.recipes.length} of ${recipesData.totalCount} saved recipes`
              : "No saved recipes found"}
          </p>
        </div>

        {recipesData.totalPages > 1 && (
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-zinc-400">
            <span>
              Page {recipesData.currentPage} of {recipesData.totalPages}
            </span>
          </div>
        )}
      </div>

      <div className="w-full flex flex-col justify-between min-h-[400px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {recipesData.recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>

        {recipesData.totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={recipesData.currentPage}
              totalPages={recipesData.totalPages}
              hasNextPage={recipesData.hasNextPage}
              hasPrevPage={recipesData.hasPrevPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedRecipesContent;