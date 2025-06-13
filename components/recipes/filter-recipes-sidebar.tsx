"use client";
import React, { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X, Filter } from "lucide-react";
import GlobalSearch from "@/components/global-search";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface FilterRecipesSidebarProps {
  categories: Category[];
}

const FilterRecipesSidebar: React.FC<FilterRecipesSidebarProps> = ({
  categories,
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentType = searchParams.get("type") || "";
  const currentDifficulty = searchParams.get("difficulty") || "";
  const currentCookingTime = searchParams.get("cookingTime") || "";
  const currentServes = searchParams.get("serves") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentSortBy = searchParams.get("sortBy") || "";

  const [filters, setFilters] = useState({
    type: currentType,
    difficulty: currentDifficulty,
    cookingTime: currentCookingTime,
    serves: currentServes,
    category: currentCategory,
    sortBy: currentSortBy,
  });

  const handleFilterChange = (key: string, value: string) => {
    const urlValue = value === "all" ? "" : value;
    const newFilters = { ...filters, [key]: urlValue };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const handleTypeChange = (type: "veg" | "non-veg", checked: boolean) => {
    let newType = filters.type;

    if (checked) {
      if (!newType.includes(type)) {
        newType = newType ? `${newType},${type}` : type;
      }
    } else {
      newType = newType
        .split(",")
        .filter((t) => t !== type)
        .join(",");
    }

    handleFilterChange("type", newType);
  };

  const updateURL = (newFilters: typeof filters) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    params.delete("page");

    replace(`${pathname}?${params.toString()}`);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      type: "",
      difficulty: "",
      cookingTime: "",
      serves: "",
      category: "",
      sortBy: "",
    };
    setFilters(clearedFilters);

    const params = new URLSearchParams(searchParams);
    const query = params.get("query");
    Array.from(params.keys()).forEach((key) => params.delete(key));
    if (query) params.set("query", query);

    replace(`${pathname}?${params.toString()}`);
  };

  const isTypeSelected = (type: string) => {
    return filters.type.split(",").includes(type);
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  const getSelectValue = (filterValue: string) => {
    return filterValue === "" ? "all" : filterValue;
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-start bg-black p-6">
      {/* Search Section */}
      <div className="w-full mt-4">
        <GlobalSearch
          variant="page"
          className="w-full max-w-sm"
          placeholder="Search recipes..."
        />
      </div>

      {/* Filters Header */}
      <div className="w-full mt-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </h1>
        {hasActiveFilters && (
          <Button
            onClick={clearAllFilters}
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Recipe Type Filter */}
      <div className="w-full mt-6">
        <h3 className="text-sm font-medium text-gray-300 mb-3">Recipe Type</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="veg"
              checked={isTypeSelected("veg")}
              onCheckedChange={(checked) => handleTypeChange("veg", !!checked)}
            />
            <label
              htmlFor="veg"
              className="text-sm text-woodsmoke-200 cursor-pointer"
            >
              Vegetarian
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="non-veg"
              checked={isTypeSelected("non-veg")}
              onCheckedChange={(checked) =>
                handleTypeChange("non-veg", !!checked)
              }
            />
            <label
              htmlFor="non-veg"
              className="text-sm text-woodsmoke-200 cursor-pointer"
            >
              Non-Vegetarian
            </label>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="w-full mt-6">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Category</h3>
          <Select
            value={getSelectValue(filters.category)}
            onValueChange={(value) => handleFilterChange("category", value)}
          >
            <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all" className="text-white">
                All Categories
              </SelectItem>
              {categories.map((category) => (
                <SelectItem
                  key={category._id}
                  value={category._id}
                  className="text-white"
                >
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Difficulty Filter */}
      <div className="w-full mt-6">
        <h3 className="text-sm font-medium text-gray-300 mb-3">Difficulty</h3>
        <Select
          value={getSelectValue(filters.difficulty)}
          onValueChange={(value) => handleFilterChange("difficulty", value)}
        >
          <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Select Difficulty" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="all" className="text-white">
              All Difficulties
            </SelectItem>
            <SelectItem value="easy" className="text-white">
              Easy
            </SelectItem>
            <SelectItem value="medium" className="text-white">
              Medium
            </SelectItem>
            <SelectItem value="hard" className="text-white">
              Hard
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cooking Time Filter */}
      <div className="w-full mt-6">
        <h3 className="text-sm font-medium text-gray-300 mb-3">Cooking Time</h3>
        <Select
          value={getSelectValue(filters.cookingTime)}
          onValueChange={(value) => handleFilterChange("cookingTime", value)}
        >
          <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Select Time" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="all" className="text-white">
              Any Time
            </SelectItem>
            <SelectItem value="15" className="text-white">
              Under 15 mins
            </SelectItem>
            <SelectItem value="30" className="text-white">
              Under 30 mins
            </SelectItem>
            <SelectItem value="60" className="text-white">
              Under 1 hour
            </SelectItem>
            <SelectItem value="120" className="text-white">
              Under 2 hours
            </SelectItem>
            <SelectItem value="180" className="text-white">
              3+ hours
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Serves Filter */}
      <div className="w-full mt-6">
        <h3 className="text-sm font-medium text-gray-300 mb-3">Serves</h3>
        <Select
          value={getSelectValue(filters.serves)}
          onValueChange={(value) => handleFilterChange("serves", value)}
        >
          <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Select Servings" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="all" className="text-white">
              Any Serving
            </SelectItem>
            <SelectItem value="1" className="text-white">
              1 person
            </SelectItem>
            <SelectItem value="2" className="text-white">
              2 people
            </SelectItem>
            <SelectItem value="3" className="text-white">
              3 people
            </SelectItem>
            <SelectItem value="4" className="text-white">
              4 people
            </SelectItem>
            <SelectItem value="5" className="text-white">
              5+ people
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort Options */}
      <div className="w-full mt-6">
        <h3 className="text-sm font-medium text-gray-300 mb-3">Sort By</h3>
        <Select
          value={getSelectValue(filters.sortBy)}
          onValueChange={(value) => handleFilterChange("sortBy", value)}
        >
          <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Sort recipes" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="all" className="text-white">
              Default
            </SelectItem>
            <SelectItem value="newest" className="text-white">
              Newest First
            </SelectItem>
            <SelectItem value="oldest" className="text-white">
              Oldest First
            </SelectItem>
            <SelectItem value="most-liked" className="text-white">
              Most Liked
            </SelectItem>
            <SelectItem value="most-viewed" className="text-white">
              Most Viewed
            </SelectItem>
            <SelectItem value="cooking-time-asc" className="text-white">
              Quick to Cook
            </SelectItem>
            <SelectItem value="cooking-time-desc" className="text-white">
              Long to Cook
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FilterRecipesSidebar;
