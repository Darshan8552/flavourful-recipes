"use client";
import React, { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, X, SlidersHorizontal } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface MobileFilterSheetProps {
  categories: Category[];
}

const MobileFilterSheet: React.FC<MobileFilterSheetProps> = ({
  categories,
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isOpen, setIsOpen] = useState(false);

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
    setIsOpen(false);
  };

  const isTypeSelected = (type: string) => {
    return filters.type.split(",").includes(type);
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");
  const activeFiltersCount = Object.values(filters).filter(
    (value) => value !== ""
  ).length;

  const getSelectValue = (filterValue: string) => {
    return filterValue === "" ? "all" : filterValue;
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="lg:hidden border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-zinc-100 hover:bg-gray-100 dark:hover:bg-zinc-800 relative bg-white dark:bg-zinc-900"
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-green-600 dark:bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[320px] bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 overflow-y-auto px-2"
      >
        <SheetHeader>
          <SheetTitle className="text-gray-900 dark:text-zinc-100 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter Recipes
            {hasActiveFilters && (
              <Button
                onClick={clearAllFilters}
                variant="ghost"
                size="sm"
                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-400/10 ml-auto"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </SheetTitle>
          <SheetDescription className="text-gray-600 dark:text-zinc-400">
            Customize your recipe search with filters below
          </SheetDescription>
        </SheetHeader>

        <div className="py-2 space-y-6">
          {/* Recipe Type Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-zinc-300 mb-3">
              Recipe Type
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mobile-veg"
                  checked={isTypeSelected("veg")}
                  onCheckedChange={(checked) =>
                    handleTypeChange("veg", !!checked)
                  }
                />
                <label
                  htmlFor="mobile-veg"
                  className="text-sm text-gray-800 dark:text-zinc-200 cursor-pointer"
                >
                  Vegetarian
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mobile-non-veg"
                  checked={isTypeSelected("non-veg")}
                  onCheckedChange={(checked) =>
                    handleTypeChange("non-veg", !!checked)
                  }
                />
                <label
                  htmlFor="mobile-non-veg"
                  className="text-sm text-gray-800 dark:text-zinc-200 cursor-pointer"
                >
                  Non-Vegetarian
                </label>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-zinc-300 mb-3">
                Category
              </h3>
              <Select
                value={getSelectValue(filters.category)}
                onValueChange={(value) => handleFilterChange("category", value)}
              >
                <SelectTrigger className="w-full bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-zinc-100">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700">
                  <SelectItem value="all" className="text-gray-900 dark:text-zinc-100">
                    All Categories
                  </SelectItem>
                  {categories.map((category) => (
                    <SelectItem
                      key={category._id}
                      value={category._id}
                      className="text-gray-900 dark:text-zinc-100"
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Difficulty Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-zinc-300 mb-3">
              Difficulty Level
            </h3>
            <Select
              value={getSelectValue(filters.difficulty)}
              onValueChange={(value) => handleFilterChange("difficulty", value)}
            >
              <SelectTrigger className="w-full bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-zinc-100">
                <SelectValue placeholder="Select Difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700">
                <SelectItem value="all" className="text-gray-900 dark:text-zinc-100">
                  All Difficulties
                </SelectItem>
                <SelectItem value="easy" className="text-gray-900 dark:text-zinc-100">
                  Easy
                </SelectItem>
                <SelectItem value="medium" className="text-gray-900 dark:text-zinc-100">
                  Medium
                </SelectItem>
                <SelectItem value="hard" className="text-gray-900 dark:text-zinc-100">
                  Hard
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Cooking Time Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-zinc-300 mb-3">
              Cooking Time
            </h3>
            <Select
              value={getSelectValue(filters.cookingTime)}
              onValueChange={(value) =>
                handleFilterChange("cookingTime", value)
              }
            >
              <SelectTrigger className="w-full bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-zinc-100">
                <SelectValue placeholder="Select Time" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700">
                <SelectItem value="all" className="text-gray-900 dark:text-zinc-100">
                  Any Time
                </SelectItem>
                <SelectItem value="15" className="text-gray-900 dark:text-zinc-100">
                  Under 15 mins
                </SelectItem>
                <SelectItem value="30" className="text-gray-900 dark:text-zinc-100">
                  Under 30 mins
                </SelectItem>
                <SelectItem value="60" className="text-gray-900 dark:text-zinc-100">
                  Under 1 hour
                </SelectItem>
                <SelectItem value="120" className="text-gray-900 dark:text-zinc-100">
                  Under 2 hours
                </SelectItem>
                <SelectItem value="180" className="text-gray-900 dark:text-zinc-100">
                  3+ hours
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Serves Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-zinc-300 mb-3">Servings</h3>
            <Select
              value={getSelectValue(filters.serves)}
              onValueChange={(value) => handleFilterChange("serves", value)}
            >
              <SelectTrigger className="w-full bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-zinc-100">
                <SelectValue placeholder="Select Servings" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700">
                <SelectItem value="all" className="text-gray-900 dark:text-zinc-100">
                  Any Serving
                </SelectItem>
                <SelectItem value="1" className="text-gray-900 dark:text-zinc-100">
                  1 person
                </SelectItem>
                <SelectItem value="2" className="text-gray-900 dark:text-zinc-100">
                  2 people
                </SelectItem>
                <SelectItem value="3" className="text-gray-900 dark:text-zinc-100">
                  3 people
                </SelectItem>
                <SelectItem value="4" className="text-gray-900 dark:text-zinc-100">
                  4 people
                </SelectItem>
                <SelectItem value="5" className="text-gray-900 dark:text-zinc-100">
                  5+ people
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Options */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-zinc-300 mb-3">Sort By</h3>
            <Select
              value={getSelectValue(filters.sortBy)}
              onValueChange={(value) => handleFilterChange("sortBy", value)}
            >
              <SelectTrigger className="w-full bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-zinc-100">
                <SelectValue placeholder="Sort recipes" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700">
                <SelectItem value="all" className="text-gray-900 dark:text-zinc-100">
                  Default
                </SelectItem>
                <SelectItem value="newest" className="text-gray-900 dark:text-zinc-100">
                  Newest First
                </SelectItem>
                <SelectItem value="oldest" className="text-gray-900 dark:text-zinc-100">
                  Oldest First
                </SelectItem>
                <SelectItem value="most-liked" className="text-gray-900 dark:text-zinc-100">
                  Most Liked
                </SelectItem>
                <SelectItem value="most-viewed" className="text-gray-900 dark:text-zinc-100">
                  Most Viewed
                </SelectItem>
                <SelectItem value="cooking-time-asc" className="text-gray-900 dark:text-zinc-100">
                  Quick to Cook
                </SelectItem>
                <SelectItem value="cooking-time-desc" className="text-gray-900 dark:text-zinc-100">
                  Long to Cook
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileFilterSheet;