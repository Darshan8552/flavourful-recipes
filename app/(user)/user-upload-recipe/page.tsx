"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Ham,
  Loader,
  Plus,
  Upload,
  Vegan,
  WandSparkles,
  X,
} from "lucide-react";
import Image from "next/image";
import React, { useState, useTransition } from "react";
import axios from "axios";
import { recipeCategories } from "@/components/admin/categories";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { toast } from "sonner";
import { useAuth } from "@/lib/providers/auth-provider";
import { uploadRecipe } from "@/actions/recipes-action";
import { IRecipeUploadData } from "@/lib/types/auth-types";
import PreviewRecipe from "./preview-recipe";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const UploadRecipes = () => {
  const { session } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [selectedCategories, setSelectedCategories] = useState<string>("");
  const [customCategory, setCustomCategory] = useState<string>("");
  const [title, setTitle] = useState("");
  const [serving, setServing] = useState<number>(0);
  const [cookingTime, setCookingTime] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<string>("");
  const [author, setAuthor] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState<string>("");
  const [instructions, setInstructions] = useState<
    { subheading: string; steps: string }[]
  >([{ subheading: "", steps: "" }]);

  const authenticator = async () => {
    try {
      const response = await fetch("/api/upload-auth");
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }
      const data = await response.json();
      const { signature, expire, token, publicKey } = data;
      return { signature, expire, token, publicKey };
    } catch (error) {
      console.error("Authentication error:", error);
      throw new Error("Authentication request failed");
    }
  };

  const uploadImageAndRecipe = () => {
    startTransition(async () => {
      try {
        const { signature, expire, token, publicKey } = await authenticator();
        const uploadResponse = await upload({
          expire,
          token,
          signature,
          publicKey,
          file: imagePreview ? imagePreview : "",
          useUniqueFileName: true,
          fileName: `${title.replace(/\s+/g, "-").toLowerCase()}.png`,
          folder: "/recipes",
        });
        if (!uploadResponse || !uploadResponse.url) {
          throw new Error("Image upload failed");
        }
        const recipeData: IRecipeUploadData = {
          title,
          createdBy: session?.user.id as string,
          imageId: uploadResponse.fileId as string,
          imageUrl: uploadResponse.url,
          type,
          description,
          ingredients,
          instructions,
          category: selectedCategories,
          cookingTime,
          serves: serving,
          difficulty,
        };
        const { success } = await uploadRecipe(recipeData);
        if (success === true) {
          setImagePreview(null);
          setTitle("");
          setAuthor("");
          setIngredients([""]);
          setInstructions([{ subheading: "", steps: "" }]);
          setSelectedCategories("");
          setCookingTime(0);
          setServing(0);
          setDifficulty("");
          setDescription("");
          setType("");
          toast.success("Recipe uploaded successfully!");
        } else if (success === false) {
          toast.error("Recipe upload failed!");
        }
      } catch (error) {
        if (error instanceof ImageKitAbortError) {
          console.error("Upload aborted:", error.reason);
        } else if (error instanceof ImageKitInvalidRequestError) {
          console.error("Invalid request:", error.message);
        } else if (error instanceof ImageKitUploadNetworkError) {
          console.error("Network error:", error.message);
        } else if (error instanceof ImageKitServerError) {
          console.error("Server error:", error.message);
        } else {
          console.error("Upload error:", error);
        }
      }
    });
  };

  const generateImage = () => {
    startTransition(async () => {
      try {
        const response = await axios.post("/api/generate-recipe", {
          title,
        });

        const base64String = response.data.imageData;
        setImagePreview(`data:image/png;base64,${base64String}`);
        setTitle(response.data.recipe.title);
        setIngredients(response.data.recipe.ingredients);
        setInstructions(response.data.recipe.instructions);
        setSelectedCategories(response.data.recipe.categories);
        setAuthor(session?.user?.name as string);
        setCookingTime(response.data.recipe.cooking_time);
        setServing(response.data.recipe.serves);
        setDifficulty(response.data.recipe.difficulty);
        setDescription(response.data.recipe.description);
        setType(response.data.recipe.type === "veg" ? "veg" : "non-veg");
      } catch (error) {
        console.error("An error occurred during the transition:", error);
      }
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addIngredients = () => {
    setIngredients([...ingredients, ""]);
  };
  const updateIngredients = (index: number, value: string) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const removeIngredients = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const removeInstructions = (index: number) => {
    if (instructions.length > 1) {
      setInstructions(instructions.filter((_, i) => i !== index));
    }
  };

  const updateInstructions = (
    index: number,
    field: "subheading" | "steps",
    value: string
  ) => {
    const updated = [...instructions];
    updated[index][field] = value;
    setInstructions(updated);
  };

  const addInstructions = () => {
    setInstructions([...instructions, { subheading: "", steps: "" }]);
  };

  const addCustomCategory = () => {
    const trimmedCategory = customCategory.trim();
    if (trimmedCategory && !selectedCategories.includes(trimmedCategory)) {
      setSelectedCategories(trimmedCategory);
      setCustomCategory("");
    }
  };

  const removeCategory = () => {
    setSelectedCategories("");
  };

  const recipes = {
    title,
    createdBy: session?.user.name as string,
    imageUrl: imagePreview as string,
    type,
    description,
    ingredients,
    instructions,
    category: selectedCategories,
    cookingTime,
    serves: serving,
    difficulty,
  };

  return (
    <div className="flex w-full px-4 min-h-screen flex-col py-6">
      <h1 className="text-2xl font-bold mb-5">Upload Recipe</h1>
      <div className="flex w-full gap-3">
        <PreviewRecipe recipe={recipes} />
        <Card className="w-full max-w-3xl">
          <CardContent className=" space-y-2">
            {/* Info Section */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label
                  htmlFor="title"
                  className="text-xl font-bold text-gray-900 dark:text-zinc-100"
                >
                  Recipe Title
                </Label>
                <div className="flex items-center justify-center gap-2">
                  <Input
                    id="title"
                    placeholder="Enter your amazing recipe title"
                    className="text-lg bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-zinc-100 placeholder:text-gray-600 dark:placeholder:text-zinc-400 focus:border-sky-500 dark:focus:border-sky-400 focus:ring-sky-500/20 dark:focus:ring-sky-400/20 h-12"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isPending}
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        className="min-h-12 border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-zinc-100 hover:bg-gray-50 dark:hover:bg-neutral-800"
                        onClick={generateImage}
                        disabled={!title}
                      >
                        {isPending ? (
                          <Loader className="animate-spin transition-all" />
                        ) : (
                          <WandSparkles className="size-5" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-semibold">Generate recipe</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div className="space-y-3">
                <Label
                  htmlFor="author"
                  className="text-xl font-bold text-gray-900 dark:text-zinc-100"
                >
                  Author Name
                </Label>
                <Input
                  id="author"
                  name="author"
                  placeholder="Your name"
                  className="text-lg bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-zinc-100 placeholder:text-gray-600 dark:placeholder:text-zinc-400 focus:border-sky-500 dark:focus:border-sky-400 focus:ring-sky-500/20 dark:focus:ring-sky-400/20 h-12"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>
            </div>

            {/* Image Section */}
            <div className="space-y-4">
              <Label className="text-xl font-bold text-gray-900 dark:text-zinc-100">
                Recipe Image
              </Label>
              <div className="border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-xl p-8 text-center hover:border-green-600 dark:hover:border-green-500 transition-all duration-300">
                {imagePreview ? (
                  <div className="relative h-[350px] w-[500px] mx-auto">
                    <Image
                      src={
                        imagePreview ||
                        "https://ik.imagekit.io/4kojujvb7/Top_10_Healthy_Habits_for_a_Better_Life_Zyk4rhz1Y.jpg?updatedAt=1746885432667"
                      }
                      alt="Recipe preview"
                      fill
                      className="mx-auto rounded-xl object-cover max-h-80 shadow-lg"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-3 right-3 rounded-full shadow-lg bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                      onClick={() => setImagePreview(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <Upload className="mx-auto h-16 w-16 text-gray-600 dark:text-zinc-400" />
                    <div className="mx-auto flex items-center justify-center">
                      <Label htmlFor="image-upload" className="cursor-pointer">
                        <span className="text-gray-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-500 text-lg font-semibold">
                          Click to upload
                        </span>
                        <span className="text-gray-600 dark:text-zinc-400 text-lg ml-1">
                          or drag and drop
                        </span>
                      </Label>
                      <Input
                        id="image-upload"
                        className="hidden"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isPending}
                      />
                    </div>
                    <p className="text-gray-500 dark:text-zinc-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Recipe Type */}
            <div className="space-y-3">
              <Label className="text-xl font-bold text-gray-900 dark:text-zinc-100">
                Recipe Type
              </Label>
              <Select value={type} onValueChange={(value) => setType(value)}>
                <SelectTrigger className="w-full md:w-64 bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-zinc-100 focus:border-sky-500 dark:focus:border-sky-400 h-12">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-700">
                  <SelectItem
                    value="veg"
                    className="text-gray-900 dark:text-zinc-100 focus:bg-gray-50 dark:focus:bg-neutral-700"
                  >
                    <Vegan className="stroke-green-600 dark:stroke-green-500" />{" "}
                    Vegetarian
                  </SelectItem>
                  <SelectItem
                    value="non-veg"
                    className="text-gray-900 dark:text-zinc-100 focus:bg-gray-50 dark:focus:bg-neutral-700"
                  >
                    <Ham className="stroke-red-600 dark:stroke-red-500" />{" "}
                    Non-Vegetarian
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description Section */}
            <div className="space-y-3">
              <Label
                htmlFor="description"
                className="text-xl font-bold text-gray-900 dark:text-zinc-100"
              >
                Short Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your recipe in a few sentences..."
                className="bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-zinc-100 placeholder:text-gray-600 dark:placeholder:text-zinc-400 focus:border-sky-500 dark:focus:border-sky-400 min-h-24 resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isPending}
              />
              <p className="text-sm text-gray-500 dark:text-zinc-500">
                A short introduction to your recipe. What makes it special? When
                do you serve it?
              </p>
            </div>

            {/* Ingredients Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Label className="text-xl font-bold text-gray-900 dark:text-zinc-100">
                  Ingredients
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-green-600 dark:border-green-500 text-green-600 dark:text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 font-semibold"
                  onClick={addIngredients}
                  disabled={isPending}
                >
                  <Plus className="size-4 mr-2" />
                  Add Ingredients
                </Button>
              </div>
              <div className="space-y-4">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-3">
                    <Input
                      placeholder={`Ingredient ${index + 1}`}
                      value={ingredient}
                      onChange={(e) => updateIngredients(index, e.target.value)}
                      disabled={isPending}
                      className="bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-zinc-100 placeholder:text-gray-600 dark:placeholder:text-zinc-400 focus:border-sky-500 dark:focus:border-sky-400"
                    />
                    {ingredients.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeIngredients(index)}
                        className="border-red-600 dark:border-red-500 text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 px-3"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Label className="text-xl font-bold text-gray-900 dark:text-zinc-100">
                  Instructions
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addInstructions}
                  className="border-green-600 dark:border-green-500 text-green-600 dark:text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 font-semibold"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Step
                </Button>
              </div>
              <div className="space-y-6">
                {instructions.map((instruction, index) => (
                  <Card
                    key={index}
                    className="bg-white dark:bg-neutral-800/50 border-gray-300 dark:border-neutral-700"
                  >
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="bg-green-600 dark:bg-green-500 text-white dark:text-black text-sm font-bold px-4 py-2 rounded-full">
                            Step {index + 1}
                          </span>
                          {instructions.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeInstructions(index)}
                              className="border-red-600 dark:border-red-500 text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <Input
                          placeholder="Sub-heading (optional)"
                          value={instruction.subheading}
                          onChange={(e) =>
                            updateInstructions(
                              index,
                              "subheading",
                              e.target.value
                            )
                          }
                          className="bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-zinc-100 placeholder:text-gray-600 dark:placeholder:text-zinc-400 focus:border-sky-500 dark:focus:border-sky-400 h-12"
                        />
                        <Textarea
                          placeholder="Detailed cooking steps..."
                          value={instruction.steps}
                          onChange={(e) =>
                            updateInstructions(index, "steps", e.target.value)
                          }
                          className="bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-zinc-100 placeholder:text-gray-600 dark:placeholder:text-zinc-400 focus:border-sky-500 dark:focus:border-sky-400 min-h-24 resize-none"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Categories Section */}
            <div className="space-y-6">
              <Label className="text-xl font-bold text-gray-900 dark:text-zinc-100">
                Categories
              </Label>
              <p className="text-gray-500 dark:text-zinc-500">
                Select categories that apply to your recipe
              </p>

              {/* Category Selection */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <Select
                    onValueChange={(value) => {
                      setSelectedCategories(value);
                    }}
                  >
                    <SelectTrigger className="bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-zinc-100 focus:border-orange-500 dark:focus:border-orange-400 h-12">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-700 max-h-60">
                      {recipeCategories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id}
                          className="text-gray-900 dark:text-zinc-100 focus:bg-gray-50 dark:focus:bg-neutral-700"
                          disabled={selectedCategories === category.id}
                        >
                          <span className="flex items-center gap-2">
                            <span>{category.emoji}</span>
                            <span>{category.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Add Custom Category */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom category"
                    disabled={isPending}
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-zinc-100 placeholder:text-gray-600 dark:placeholder:text-zinc-400 focus:border-orange-500 dark:focus:border-orange-400 h-12 w-48"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCustomCategory}
                    disabled={!customCategory}
                    className="border-orange-500 dark:border-orange-400 text-orange-500 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-400/10 font-semibold h-12 px-4"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Selected Categories Display */}
              {selectedCategories.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-600 dark:text-zinc-400 uppercase tracking-wide">
                    Selected Categories
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {
                      //display selected category
                      (() => {
                        const category = recipeCategories.find(
                          (cat) => cat.id === selectedCategories
                        );
                        const isCustom = !category;
                        const displayName = category
                          ? category.label
                          : selectedCategories;
                        const emoji = category ? category.emoji : "🏷️";

                        return (
                          <div
                            key={selectedCategories}
                            className="flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 dark:from-orange-400/20 dark:to-red-400/20 border border-orange-500/30 dark:border-orange-400/30 rounded-full px-4 py-2"
                          >
                            <span className="text-sm">{emoji}</span>
                            <span className="text-gray-900 dark:text-zinc-100 font-medium text-sm">
                              {displayName}
                            </span>
                            {isCustom && (
                              <span className="text-xs bg-purple-500/20 dark:bg-purple-400/20 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded-full">
                                Custom
                              </span>
                            )}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCategory()} //remove the category
                              className="h-5 w-5 p-0 hover:bg-red-500/20 dark:hover:bg-red-400/20 text-gray-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        );
                      })()
                    }
                  </div>
                </div>
              )}
            </div>

            {/* Cooking Details Section */}
            <div className="space-y-6">
              <Label className="text-xl font-bold text-gray-900 dark:text-zinc-100">
                Cooking Details
              </Label>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="cooking-time"
                    className="text-sm font-semibold text-gray-600 dark:text-zinc-400 uppercase tracking-wide"
                  >
                    Cooking Time (minutes)
                  </Label>
                  <Input
                    id="cooking-time"
                    type="number"
                    placeholder="30"
                    className="bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-zinc-100 placeholder:text-gray-600 dark:placeholder:text-zinc-400 focus:border-sky-500 dark:focus:border-sky-400 h-12"
                    value={cookingTime}
                    onChange={(e) => setCookingTime(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-3">
                  <Label
                    htmlFor="servings"
                    className="text-sm font-semibold text-gray-600 dark:text-zinc-400 uppercase tracking-wide"
                  >
                    Servings
                  </Label>
                  <Input
                    id="servings"
                    type="number"
                    placeholder="4"
                    className="bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-zinc-100 placeholder:text-gray-600 dark:placeholder:text-zinc-400 focus:border-sky-500 dark:focus:border-sky-400 h-12"
                    value={serving}
                    onChange={(e) => setServing(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-600 dark:text-zinc-400 uppercase tracking-wide">
                    Difficulty
                  </Label>
                  <Select
                    value={difficulty}
                    onValueChange={(value) => setDifficulty(value)}
                  >
                    <SelectTrigger className="min-w-[200px] min-h-11 bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-zinc-100 focus:border-sky-500 dark:focus:border-sky-400 h-12">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-700">
                      <SelectItem
                        value="easy"
                        className="text-gray-900 dark:text-zinc-100 focus:bg-gray-50 dark:focus:bg-neutral-700"
                      >
                        Easy
                      </SelectItem>
                      <SelectItem
                        value="medium"
                        className="text-gray-900 dark:text-zinc-100 focus:bg-gray-50 dark:focus:bg-neutral-700"
                      >
                        Medium
                      </SelectItem>
                      <SelectItem
                        value="hard"
                        className="text-gray-900 dark:text-zinc-100 focus:bg-gray-50 dark:focus:bg-neutral-700"
                      >
                        Hard
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Upload Button */}
            <div className="pt-8">
              <Button
                type="submit"
                size="lg"
                className="w-full font-bold py-4 text-xl text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
                onClick={uploadImageAndRecipe}
              >
                {isPending ? (
                  <Loader className="animate-spin mr-2" />
                ) : (
                  <>
                    <Upload className="h-6 w-6 mr-3" />
                    Upload Recipe
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UploadRecipes;
