"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { IRecipeUploadData } from "@/lib/types/auth-types";
import Image from "next/image";
import React from "react";

interface PreviewRecipeProps {
  recipe: Omit<IRecipeUploadData, "imageId" | "_id"> & { views?: number };
}
const PreviewRecipe = ({ recipe }: PreviewRecipeProps) => {
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
            style={{ objectFit: "cover" }}
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
            By {recipe.createdBy} | {new Date().toDateString()} |
            <span className="flex items-center gap-1 justify-center">
              102 Views
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
        <div className="flex gap-4 mt-6 w-full">
          <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#2e352c] pl-4 pr-4">
            <p className="text-white text-sm font-medium leading-normal">
              {recipe.category}
            </p>
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
            {recipe.ingredients.map((ingredient: string) => (
              <div className="flex items-center mb-4" key={ingredient}>
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
            {recipe.instructions.map((instruction, index: number) => (
              <div className="flex justify-center mb-4 flex-col" key={index}>
                <span className="border rounded-2xl max-w-fit px-4 h-8 flex items-center justify-center">
                  Step {index + 1}
                </span>
                <h1 className="dark:text-woodsmoke-200 text-xl ml-2 mt-2">
                  {instruction.subheading}
                </h1>
                {instruction.steps ? (
                  Array.isArray(instruction.steps) ? (
                    <ul className="list-disc list-inside ml-8 mt-2 space-y-1">
                      {(instruction.steps as string[]).map(
                        (step: string, stepIndex: number) => (
                          <li key={stepIndex}>{step}</li>
                        )
                      )}
                    </ul>
                  ) : typeof instruction.steps === 'string' ? (
                    // Split string steps by line breaks and create list
                    <ul className="list-disc list-inside ml-8 mt-2 space-y-1">
                      {(instruction.steps as string)
                        .split("\n")
                        .filter((step: string) => step.trim())
                        .map((step: string, stepIndex: number) => (
                          <li key={stepIndex}>{step.trim()}</li>
                        ))}
                    </ul>
                  ) : (
                    <p className="ml-8 mt-2 text-gray-500">No steps available</p>
                  )
                ) : (
                  <p className="ml-8 mt-2 text-gray-500">No steps available</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PreviewRecipe;
