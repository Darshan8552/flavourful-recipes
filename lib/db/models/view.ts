import { IViewedRecipe } from "@/lib/types/auth-types";
import mongoose, { Model, Schema } from "mongoose";

const ViewSchema = new Schema<IViewedRecipe>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipeId: {
      type: Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const ViewModel: Model<IViewedRecipe> =
  mongoose.models.View || mongoose.model<IViewedRecipe>("View", ViewSchema);
