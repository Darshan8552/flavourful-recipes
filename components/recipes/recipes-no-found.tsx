"use client";
import { ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecipeFilters } from "@/actions/recipes-filter-actions";

const NoRecipesFound = ({ filters }: { filters: RecipeFilters }) => {
  const hasFilters = Object.values(filters).some(
    (value) => value && value !== "1"
  );

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-24 h-24 bg-gray-200 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
        <ChefHat className="w-12 h-12 text-gray-600 dark:text-zinc-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-zinc-100 mb-2">
        {hasFilters ? "No recipes match your filters" : "No recipes found"}
      </h3>
      <p className="text-gray-600 dark:text-zinc-400 mb-6 max-w-md">
        {hasFilters
          ? "Try adjusting your filters or search terms to find more recipes."
          : "It looks like there are no recipes available at the moment."}
      </p>
      {hasFilters && (
        <Button
          onClick={() => (window.location.href = "/recipes")}
          className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white"
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );
};

export default NoRecipesFound;