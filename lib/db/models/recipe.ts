import { IRecipe } from "@/lib/types/auth-types";
import mongoose, { Model, Schema } from "mongoose";

const recipeSchema = new Schema<IRecipe>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author Name is required"],
    },
    imageId: {
      type: String,
      required: [true, "Image Id is required"],
    },
    imageUrl: {
      type: String,
      required: [true, "Image Url is required"],
    },
    type: {
      type: String,
      enum: ["veg", "non-veg"],
      required: [true, "Type is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    ingredients: {
      type: [String],
      required: [true, "Ingredients are required"],
    },
    instructions: {
      type: [
        {
          subheading: {
            type: String,
            required: [true, "Subheading is required"],
          },
          steps: {
            type: [String],
            required: [true, "Steps are required"],
          },
        },
      ],
      required: [true, "Instructions are required"],
    },
    category:
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    cookingTime: {
      type: Number,
      required: [true, "Cooking Time is required"],
    },
    serves: {
      type: Number,
      required: [true, "Serves is required"],
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: [true, "Difficulty is required"],
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likeCount: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const RecipeModel: Model<IRecipe> =
  mongoose.models.Recipe || mongoose.model<IRecipe>("Recipe", recipeSchema);
