import { getComments } from "@/actions/comment-actions";
import { findById } from "@/actions/like-action";
import {
  getAuthorName,
  getCategoryName,
  getRecipeById,
} from "@/actions/recipes-action";
import CommentsSection from "@/components/comments/CommentsSection";
import SimilarRecipes from "@/components/recipes/SimilarRecipes";
import BookmarkButton from "@/components/ui/BookmarkButton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import LikeButton from "@/components/ui/like-button";
import { getSession } from "@/lib/auth/auth";
import { Instruction } from "@/lib/types/auth-types";
import { Types } from "mongoose";
import Image from "next/image";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const session = await getSession();
  const userId = session?.user.id as string;
  const { id } = await params;

  const recipe = await getRecipeById(id, userId);
  if (!recipe) return <h1>Recipe not found</h1>;

  const authorName = await getAuthorName(recipe.createdBy!.toString());
  const category = await getCategoryName(recipe.category!.toString());
  const user = await findById(userId);

  const isLiked = recipe?.likes?.some(
    (like: Types.ObjectId) => like.toString() === userId
  );

  const isSaved =
    user?.savedRecipes?.some(
      (saved: Types.ObjectId) => saved.toString() === id
    ) || false;

  const comments = await getComments(id);

  return (
    <section className="flex flex-col items-center p-4 w-full min-h-screen">
      <div className="flex flex-col items-center w-full max-w-3xl">
        <div className="relative w-full h-64 mb-4">
          <Image
            src={recipe?.imageUrl || "/placeholder.svg"}
            alt={recipe?.title || "Recipe"}
            fill
            priority
            className="object-cover w-full h-full rounded-lg shadow-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
          <h1 className="text-white absolute text-3xl font-semibold bottom-8 left-4">
            {recipe.title}
          </h1>
        </div>
      </div>
      <div className="flex w-full max-w-3xl flex-col">
        <div className="flex w-full justify-between items-center px-2">
          <span className="dark:text-[#a6b3a2] flex gap-1">
            By {authorName} | {recipe.createdAt.toDateString()} |
            <span className="flex items-center gap-1 justify-center">
              {recipe.views} {recipe.views === 1 ? "View" : "Views"}
            </span>
          </span>
          <span
            className={`${
              recipe.type === "veg" ? "text-green-500" : "text-red-500"
            }`}
          >
            {recipe.type === "veg" ? "Vegetarian" : "Non-Vegetarian"}
          </span>
        </div>
        <div className="flex gap-4 mt-6 w-full justify-between items-center">
          <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#2e352c] pl-4 pr-4">
            <p className="text-white text-sm font-medium leading-normal">
              {category}
            </p>
          </div>

          <div className="flex gap-3">
            <LikeButton
              recipeId={recipe._id.toString()}
              userId={userId}
              initialLikeCount={recipe.likeCount ?? 0}
              initialIsLiked={isLiked ?? false}
            />
            <BookmarkButton
              recipeId={recipe._id.toString()}
              userId={userId}
              initialIsSaved={isSaved}
            />
          </div>
        </div>
        <div className="flex flex-col mt-6 w-full">
          <h1 className="text-2xl font-semibold">Recipe Information</h1>
          <div className="flex flex-col mt-4 dark:text-[#a6b3a2]">
            <div className="flex w-full justify-between items-center px-2 mt-4">
              <span>Cooking Time</span>{" "}
              <span>{recipe.cookingTime} minutes</span>
            </div>
            <div className="flex w-full justify-between items-center px-2 mt-4">
              <span>Serves</span> <span>{recipe.serves}</span>
            </div>
            <div className="flex w-full justify-between items-center px-2 mt-4">
              <span>Difficulty</span> <span>{recipe.difficulty}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-6 w-full">
          <h1 className="text-2xl font-semibold">Description</h1>
          <p className="mt-4 dark:text-[#a6b3a2]">{recipe.description}</p>
        </div>
        <div className="flex flex-col mt-6 w-full">
          <h1 className="text-2xl font-semibold">Ingredients</h1>
          <div className="mt-4 dark:text-[#a6b3a2]">
            {recipe.ingredients.map((ingredient: string, index: number) => (
              <div className="flex items-center mb-4" key={index}>
                <Checkbox id={ingredient} />
                <Label htmlFor={ingredient} className="ml-2">
                  {ingredient}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col mt-6 w-full">
          <h1 className="text-2xl font-semibold">Instructions</h1>
          <div className="mt-4 dark:text-[#a6b3a2]">
            {recipe.instructions.map(
              (instruction: Instruction, index: number) => (
                <div className="flex justify-center mb-4 flex-col" key={index}>
                  <span className="border rounded-2xl max-w-fit px-4 h-8 flex items-center justify-center">
                    Step {index + 1}
                  </span>
                  <h1 className="dark:text-woodsmoke-200 text-xl ml-2 mt-2">
                    {instruction.subheading}
                  </h1>
                  <ul className="list-disc list-inside ml-8 mt-2 space-y-1">
                    {Array.isArray(instruction.steps) ? (
                      instruction.steps.map(
                        (step: string, stepIndex: number) => (
                          <li key={stepIndex}>{step}</li>
                        )
                      )
                    ) : (
                      <li>{instruction.steps}</li>
                    )}
                  </ul>
                </div>
              )
            )}
          </div>
        </div>
        <CommentsSection
          recipeId={recipe._id.toString()}
          userId={userId}
          userImage={user?.image || "/placeholder.svg"}
          userName={user?.name || "Anonymous"}
          initialComments={comments}
        />
        <SimilarRecipes
          categoryId={recipe.category!.toString()}
          currentRecipeId={recipe._id.toString()}
          categoryName={category}
        />
      </div>
    </section>
  );
}
