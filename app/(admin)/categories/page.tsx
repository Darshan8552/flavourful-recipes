import { getAllCategoriesWithPagination } from "@/actions/category-action";
import React from "react";
import CategorySearch from "./category-search";
import CategoryGrid from "./category-grid";
interface CategoryPageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

const CategoryPage = async ({ searchParams }: CategoryPageProps) => {
  const params = await searchParams;
  const search = params.search || "";
  const page = parseInt(params.page || "1");

  const categoriesData = await getAllCategoriesWithPagination({
    search,
    page: page.toString(),
  });

  return (
    <section className="flex flex-col gap-6 w-full p-4 lg:p-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-white tracking-light text-[32px] font-bold leading-tight">
          Recipe Categories
        </h1>
        <span className="text-[#ababab] text-sm font-normal leading-normal">
          Explore our diverse collection of recipe categories
        </span>
      </div>
      <div className="w-full max-w-2xl">
        <CategorySearch />
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-400">
        <span>
          {categoriesData.totalCount > 0
            ? `Showing ${categoriesData.categories.length} of ${categoriesData.totalCount} categories`
            : "No categories found"}
        </span>
        {search && (
          <span>
            for &quot;<span className="text-blue-400">{search}</span>&quot;
          </span>
        )}
        {categoriesData.totalPages > 1 && (
          <span className="ml-auto">
            Page {categoriesData.currentPage} of {categoriesData.totalPages}
          </span>
        )}
      </div>

      <CategoryGrid categoriesData={categoriesData} />
    </section>
  );
};

export default CategoryPage;
