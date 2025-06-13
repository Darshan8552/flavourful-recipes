
import { IRecipe } from "./auth-types";

export interface IPopulatedRecipe extends Omit<IRecipe, 'createdBy' | 'category'> {
  createdBy?: {
    _id?: string;
    name?: string;
    image?: string;
  } | null;
  category?: {
    _id?: string;
    name: string;
    slug?: string;
  } | null;
}

export interface RecipeCardProps {
  recipe: IPopulatedRecipe;
}

export interface RecipesContentProps {
  recipesData: {
    recipes: IPopulatedRecipe[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: {
    query?: string;
    type?: string;
    category?: string;
    difficulty?: string;
    cookingTime?: string;
    serves?: string;
    sortBy?: string;
    page?: string;
    limit?: string;
  };
}