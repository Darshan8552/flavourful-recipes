import { getAllCategories } from '@/actions/admin-recipe-action';
import RecipeSearch from '@/components/admin/recipe-search';
import RecipeTable from '@/components/admin/recipe-table';
import React from 'react';

interface RecipeManagementProps {
  searchParams: {
    search?: string;
    category?: string;
    status?: string;
    page?: string;
  };
}

const RecipeManagement = async ({ searchParams }: RecipeManagementProps) => {
  const categories = await getAllCategories();
  const params = await searchParams;

  return (
    <section className="flex flex-col gap-4 w-full p-4">
      <div className="flex min-w-72 flex-col gap-3">
        <h1 className="text-white tracking-light text-[32px] font-bold leading-tight">
          Recipe Management
        </h1>
        <span className="text-[#ababab] text-sm font-normal leading-normal">
          Manage recipes, their status, and content
        </span>
      </div>
      <div className="w-full max-w-2xl">
        <RecipeSearch categories={categories} />
      </div>
      <div className="mr-2">
        <RecipeTable searchParams={params} />
      </div>
    </section>
  );
};

export default RecipeManagement;