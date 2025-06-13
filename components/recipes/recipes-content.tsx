import {
  fetchRecipesWithFilters,
  RecipeFilters,
} from "@/actions/recipes-filter-actions";
import RecipeCard from "./recipes-card";
import NoRecipesFound from "@/components/recipes/recipes-no-found";
import Pagination from "@/components/recipes//pagination";

const RecipesContent = ({
  recipesData,
  filters,
}: {
  recipesData: Awaited<ReturnType<typeof fetchRecipesWithFilters>>;
  filters: RecipeFilters;
}) => {
  return (
    <div className="flex-1 p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Recipes</h1>
          <p className="text-gray-400 text-sm mt-1">
            {recipesData.totalCount > 0
              ? `Showing ${recipesData.recipes.length} of ${recipesData.totalCount} recipes`
              : "No recipes found"}
            {filters.query && (
              <span className="ml-2">
                for &quot;<span className="text-blue-400">{filters.query}</span>&quot;
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>
            Page {recipesData.currentPage} of {recipesData.totalPages}
          </span>
        </div>
      </div>

      <div className="w-full flex flex-col justify-between min-h-screen">
        {recipesData.recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {recipesData.recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <NoRecipesFound filters={filters} />
        )}

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

export default RecipesContent;
