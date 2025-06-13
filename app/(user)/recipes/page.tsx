import React, { Suspense } from "react";
import RecipesContent from "@/components/recipes/recipes-content";
import { Loader } from "lucide-react";
import {
  fetchRecipesWithFilters,
  getCategories,
  RecipeFilters,
} from "@/actions/recipes-filter-actions";
import FilterRecipesSidebar from "@/components/recipes/filter-recipes-sidebar";
import MobileFilterSheet from "@/components/recipes/filter-recipes-mobile";

interface RecipesPageProps {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    type?: string;
    category?: string;
    difficulty?: string;
    cookingTime?: string;
    serves?: string;
    sortBy?: string;
  }>;
}

const Recipes = async (props: RecipesPageProps) => {
  const searchParams = await props.searchParams;

  const filters: RecipeFilters = {
    query: searchParams?.query || "",
    page: searchParams?.page || "1",
    type: searchParams?.type || "",
    category: searchParams?.category || "",
    difficulty: searchParams?.difficulty || "",
    cookingTime: searchParams?.cookingTime || "",
    serves: searchParams?.serves || "",
    sortBy: searchParams?.sortBy || "",
    limit: "12",
  };

  const [recipesData, categories] = await Promise.all([
    fetchRecipesWithFilters(filters),
    getCategories(),
  ]);

  return (
    <main className="flex-col md:flex min-h-screen w-full bg-[#1a1a1a] sm:flex-row">
      <div className="hidden md:flex min-h-full w-full flex-[20%] max-w-[300px]">
        <FilterRecipesSidebar categories={categories} />
      </div>

      <div className="flex md:hidden justify-start px-4 py-2">
        <MobileFilterSheet categories={categories} />
      </div>

      <div className="flex min-h-screen w-full flex-1 md:flex-[80%]">
        <Suspense
          key={JSON.stringify(filters)}
          fallback={
            <div className="flex items-center justify-center w-full h-full">
              <Loader className="animate-spin text-white" size={32} />
              <span className="ml-2 text-white">Loading recipes...</span>
            </div>
          }
        >
          <RecipesContent recipesData={recipesData} filters={filters} />
        </Suspense>
      </div>
    </main>
  );
};

export default Recipes;
