import { fetchRecipesForAdmin } from "@/actions/admin-recipe-action";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React from "react";
import { AlertCircle, ChefHat } from "lucide-react";
import RecipeTableRow from "./recipe-table-row";
import Pagination from "./admin-pagination";

interface RecipeTableProps {
  searchParams: {
    search?: string;
    category?: string;
    status?: string;
    page?: string;
  };
}

const RecipeTable = async ({ searchParams }: RecipeTableProps) => {
  try {
    const result = await fetchRecipesForAdmin(searchParams);
    
    const { recipes, pagination } = result;

    if (!recipes || recipes.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <ChefHat className="h-12 w-12 text-[#ababab] mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            No recipes found
          </h3>
          <p className="text-[#ababab] text-sm">
            {searchParams?.search ||
            searchParams?.category !== "all" ||
            searchParams?.status !== "all"
              ? "Try adjusting your search or filters"
              : "No recipes have been created yet"}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-[#505050] bg-[#282828]">
          <div className="flex items-center justify-between p-4 border-b border-[#505050]">
            <h2 className="text-lg font-semibold text-white">
              Recipes ({pagination.totalRecipes} total, showing {recipes.length})
            </h2>
            <div className="text-sm text-[#ababab]">
              Page {pagination.currentPage} of {pagination.totalPages}
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-[#505050] hover:bg-[#333333]">
                <TableHead className="text-md font-bold w-[200px] text-[#ababab]">
                  Recipe
                </TableHead>
                <TableHead className="text-md font-bold w-[150px] text-[#ababab]">
                  Author
                </TableHead>
                <TableHead className="text-md font-bold w-[120px] text-[#ababab]">
                  Category
                </TableHead>
                <TableHead className="text-md font-bold w-[100px] text-[#ababab]">
                  Status
                </TableHead>
                <TableHead className="text-md font-bold w-[120px] text-[#ababab]">
                  Stats
                </TableHead>
                <TableHead className="text-md font-bold w-[100px] text-[#ababab]">
                  Difficulty
                </TableHead>
                <TableHead className="text-md font-bold w-[120px] text-[#ababab]">
                  Created
                </TableHead>
                <TableHead className="text-md font-bold w-[120px] text-[#ababab]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <RecipeTableRow recipes={recipes} />
          </Table>
        </div>

        {/* Pagination Component */}
        {pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            hasNextPage={pagination.hasNextPage}
            hasPrevPage={pagination.hasPrevPage}
          />
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">
          Error loading recipes
        </h3>
        <p className="text-[#ababab] text-sm">
          There was a problem loading the recipes. Please try again.
        </p>
      </div>
    );
  }
};

export default RecipeTable;