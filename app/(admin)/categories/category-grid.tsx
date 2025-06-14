import React from "react";
import CategoryCard from "./category-card";
import Pagination from "@/components/recipes/pagination";

interface CategoryGridProps {
  categoriesData: {
    categories: Array<{
      _id: string;
      name: string;
      slug: string;
      recipeCount: number;
    }>;
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categoriesData }) => {
  if (categoriesData.categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#1a1a1a] rounded-full flex items-center justify-center">
            <span className="text-2xl">📂</span>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No Categories Found
          </h3>
          <p className="text-gray-400 mb-4">
            We could&apos;t find any categories matching your search.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {categoriesData.categories.map((category) => (
          <CategoryCard key={category._id} category={category} />
        ))}
      </div>

      {categoriesData.totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={categoriesData.currentPage}
            totalPages={categoriesData.totalPages}
            hasNextPage={categoriesData.hasNextPage}
            hasPrevPage={categoriesData.hasPrevPage}
          />
        </div>
      )}
    </div>
  );
};

export default CategoryGrid;
