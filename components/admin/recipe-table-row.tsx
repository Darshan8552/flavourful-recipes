"use client";

import React, { useState } from "react";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Eye,
  Heart,
  Clock,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { updateRecipeStatus, deleteRecipe } from "@/actions/admin-recipe-action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

interface Recipe {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  category: {
    _id: string;
    name: string;
  };
  isPublished: boolean;
  views: number;
  likeCount: number;
  cookingTime: number;
  difficulty: string;
  createdAt: string;
}

interface RecipeTableRowProps {
  recipes: Recipe[];
}

const RecipeTableRow = ({ recipes }: RecipeTableRowProps) => {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleStatusToggle = async (recipeId: string, currentStatus: boolean) => {
    setIsUpdating(recipeId);
    try {
      const result = await updateRecipeStatus(recipeId, !currentStatus);
      if (result.success) {
        toast.success(`Recipe ${!currentStatus ? 'published' : 'unpublished'} successfully`);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update recipe status");
      }
    } catch (error) {
      toast.error("An error occurred while updating the recipe");
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDelete = async (recipeId: string) => {
    setIsDeleting(recipeId);
    try {
      const result = await deleteRecipe(recipeId);
      if (result.success) {
        toast.success("Recipe deleted successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete recipe");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the recipe");
    } finally {
      setIsDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "hard":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  return (
    <TableBody>
      {recipes.map((recipe) => (
        <TableRow key={recipe._id} className="border-[#505050] hover:bg-[#333333]">
          {/* Recipe Info */}
          <TableCell className="font-medium">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#404040]">
                {recipe.imageUrl ? (
                  <Image
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-[#ababab] text-xs">No Image</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium truncate">
                  {recipe.title}
                </div>
                <div className="text-[#ababab] text-sm truncate max-w-[200px]">
                  {recipe.description}
                </div>
              </div>
            </div>
          </TableCell>

          {/* Author */}
          <TableCell>
            <div className="flex flex-col">
              <span className="text-white font-medium">
                {recipe.createdBy.name}
              </span>
              <span className="text-[#ababab] text-sm">
                {recipe.createdBy.email}
              </span>
            </div>
          </TableCell>

          {/* Category */}
          <TableCell>
            <Badge variant="outline" className="bg-[#404040] border-[#505050] text-[#ababab]">
              {recipe.category.name}
            </Badge>
          </TableCell>

          {/* Status */}
          <TableCell>
            <Badge
              variant={recipe.isPublished ? "default" : "secondary"}
              className={
                recipe.isPublished
                  ? "bg-green-500/20 text-green-400 border-green-500/50"
                  : "bg-gray-500/20 text-gray-400 border-gray-500/50"
              }
            >
              {recipe.isPublished ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Published
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3 mr-1" />
                  Draft
                </>
              )}
            </Badge>
          </TableCell>

          {/* Stats */}
          <TableCell>
            <div className="flex flex-col space-y-1">
              <div className="flex items-center text-[#ababab] text-sm">
                <Eye className="w-3 h-3 mr-1" />
                {recipe.views}
              </div>
              <div className="flex items-center text-[#ababab] text-sm">
                <Heart className="w-3 h-3 mr-1" />
                {recipe.likeCount}
              </div>
            </div>
          </TableCell>

          {/* Difficulty */}
          <TableCell>
            <div className="flex flex-col space-y-1">
              <Badge className={getDifficultyColor(recipe.difficulty)}>
                {recipe.difficulty}
              </Badge>
              <div className="flex items-center text-[#ababab] text-sm">
                <Clock className="w-3 h-3 mr-1" />
                {recipe.cookingTime}m
              </div>
            </div>
          </TableCell>

          {/* Created Date */}
          <TableCell>
            <span className="text-[#ababab] text-sm">
              {formatDate(recipe.createdAt)}
            </span>
          </TableCell>

          {/* Actions */}
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#303030] border-[#505050]">
                <DropdownMenuItem
                  onClick={() => window.open(`/recipes/${recipe._id}`, '_blank')}
                  className="hover:bg-[#404040]"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Recipe
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push(`/admin/recipes/edit/${recipe._id}`)}
                  className="hover:bg-[#404040]"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleStatusToggle(recipe._id, recipe.isPublished)}
                  disabled={isUpdating === recipe._id}
                  className="hover:bg-[#404040]"
                >
                  {recipe.isPublished ? (
                    <>
                      <XCircle className="mr-2 h-4 w-4" />
                      Unpublish
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Publish
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="hover:bg-[#404040] text-red-400 focus:text-red-400"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-[#282828] border-[#505050]">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-[#ababab]">
                        This action cannot be undone. This will permanently delete the recipe
                        "{recipe.title}" and remove all associated data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-[#404040] border-[#505050] text-white hover:bg-[#505050]">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(recipe._id)}
                        disabled={isDeleting === recipe._id}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        {isDeleting === recipe._id ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default RecipeTableRow;