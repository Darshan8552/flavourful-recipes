"use server";

import { connectToDatabase } from "@/lib/db/connect";
import { CommentModel } from "@/lib/db/models/comment";
import { revalidatePath } from "next/cache";

export async function addComment(
  recipeId: string,
  userId: string,
  comment: string
) {
  try {
    await connectToDatabase();

    if (!comment.trim()) {
      throw new Error("Comment cannot be empty");
    }

    const newComment = new CommentModel({
      userId,
      recipeId,
      comment: comment.trim(),
    });

    await newComment.save();
    revalidatePath(`/recipes/${recipeId}`);

    return {
      success: true,
      message: "Comment added successfully",
    };
  } catch (error) {
    console.error("Error adding comment:", error);
    throw new Error("Failed to add comment");
  }
}

export async function deleteComment(
  commentId: string,
  userId: string,
  recipeId: string
) {
  try {
    await connectToDatabase();

    const comment = await CommentModel.findById(commentId);

    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.userId.toString() !== userId) {
      throw new Error("Unauthorized to delete this comment");
    }

    await CommentModel.findByIdAndDelete(commentId);

    revalidatePath(`/recipes/${recipeId}`);

    return {
      success: true,
      message: "Comment deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw new Error("Failed to delete comment");
  }
}

export async function getComments(recipeId: string) {
  try {
    await connectToDatabase();

    const comments = await CommentModel.find({ recipeId })
      .populate("userId", "name image")
      .sort({ createdAt: -1 })
      .lean();

    return comments.map((comment) => ({
      ...comment,
      _id: comment._id.toString(),
      userId: {
        _id: comment.userId._id.toString(),
        name: comment.userId.name,
        image: comment.userId.image,
      },
      recipeId: comment.recipeId.toString(),
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}
