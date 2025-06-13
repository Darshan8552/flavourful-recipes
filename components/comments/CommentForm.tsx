"use client";

import { useState, useTransition } from "react";
import { Send } from "lucide-react";
import { addComment } from "@/actions/comment-actions";

interface CommentFormProps {
  recipeId: string;
  userId: string;
  userImage: string;
  userName: string;
}

export default function CommentForm({
  recipeId,
  userId,
  userImage,
  userName,
}: CommentFormProps) {
  const [comment, setComment] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) return;

    startTransition(async () => {
      try {
        await addComment(recipeId, userId, comment);
        setComment("");
      } catch (error) {
        console.error("Failed to add comment:", error);
      }
    });
  };

  return (
    <div className="flex gap-3 p-4 items-center border-gray-300 dark:border-gray-600  rounded-lg">
      <img
        src={userImage}
        alt={userName}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />

      <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 min-h-[80px] p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#a6b3a2]  dark:text-white"
          disabled={isPending}
        />

        <button
          type="submit"
          disabled={isPending || !comment.trim()}
          className={` h-10 self-center  p-3 rounded-lg transition-all duration-200 ${
            isPending || !comment.trim()
              ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
              : "bg-woodsmoke-500 hover:bg-woodsmoke-600 text-white"
          }`}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
