"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Filter } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface RecipeSearchProps {
  categories?: Array<{ name: string; slug: string }>;
}

const RecipeSearch = ({ categories = [] }: RecipeSearchProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [categoryFilter, setCategoryFilter] = useState(
    searchParams.get("category") || "all"
  );
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "all"
  );

  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set("search", searchQuery);
    if (categoryFilter !== "all") params.set("category", categoryFilter);
    if (statusFilter !== "all") params.set("status", statusFilter);
    
    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : "";
    
    router.push(`/recipe-management${newUrl}`, { scroll: false });
  }, [searchQuery, categoryFilter, statusFilter, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setStatusFilter("all");
  };

  const hasActiveFilters = searchQuery || categoryFilter !== "all" || statusFilter !== "all";

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-4xl">
      <form onSubmit={handleSearch} className="flex-1 relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#ababab] h-4 w-4" />
          <Input
            placeholder="Search recipes by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#303030] placeholder:text-[#ababab] pl-10 pr-10"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#ababab] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      <div className="flex gap-2">
        {/* Category Filte */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className={`bg-[#303030] border-[#505050] hover:bg-[#404040] ${
                categoryFilter !== "all" ? "border-blue-500 text-blue-400" : ""
              }`}
            >
              <Filter className="h-4 w-4 mr-2" />
              Category: {categoryFilter === "all" ? "All" : 
                categories.find(cat => cat.slug === categoryFilter)?.name || categoryFilter
              }
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#303030] border-[#505050]">
            <DropdownMenuItem onClick={() => setCategoryFilter("all")}>
              All Categories
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {categories.map((category) => (
              <DropdownMenuItem 
                key={category.slug} 
                onClick={() => setCategoryFilter(category.slug)}
              >
                {category.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className={`bg-[#303030] border-[#505050] hover:bg-[#404040] ${
                statusFilter !== "all" ? "border-green-500 text-green-400" : ""
              }`}
            >
              <Filter className="h-4 w-4 mr-2" />
              Status: {statusFilter === "all" ? "All" : 
                statusFilter === "published" ? "Published" : "Draft"
              }
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#303030] border-[#505050]">
            <DropdownMenuItem onClick={() => setStatusFilter("all")}>
              All Status
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setStatusFilter("published")}>
              Published
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("draft")}>
              Draft
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="text-[#ababab] hover:text-white hover:bg-[#404040]"
          >
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};

export default RecipeSearch;