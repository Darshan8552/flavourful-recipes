"use client";

import { useState, useTransition } from "react";
import { Trash2, MoreHorizontal } from "lucide-react";
import { deleteComment } from "@/actions/comment-actions";
import Image from "next/image";

interface CommentItemProps {
  comment: {
    _id: string;
    comment: string;
    createdAt: string;
    userId: {
      _id: string;
      name: string;
      image: string;
    };
  };
  currentUserId: string;
  recipeId: string;
}

export default function CommentItem({
  comment,
  currentUserId,
  recipeId,
}: CommentItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isOwner = comment.userId._id === currentUserId;

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteComment(comment._id, currentUserId, recipeId);
      } catch (error) {
        console.error("Failed to delete comment:", error);
      }
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) {
      // 7 days
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="flex gap-3 p-4 dark:hover:border-1 dark:hover:border-dashed hover:border-woodsmoke-300 transition-colors duration-200 mb-4">
      <Image
        src={comment.userId.image}
        alt={comment.userId.name}
        width={40}
        height={40}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />

      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-gray-900 dark:text-white">
              {comment.userId.name}
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(comment.createdAt)}
            </span>
          </div>

          {isOwner && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                disabled={isPending}
              >
                <MoreHorizontal size={16} className="text-gray-500" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                  <button
                    onClick={handleDelete}
                    disabled={isPending}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left rounded-lg transition-colors duration-200"
                  >
                    <Trash2 size={14} />
                    {isPending ? "Deleting..." : "Delete"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {comment.comment}
        </p>
      </div>

      {showMenu && (
        <div className="fixed inset-0 z-5" onClick={() => setShowMenu(false)} />
      )}
    </div>
  );
}
