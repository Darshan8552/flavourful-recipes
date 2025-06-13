"use client";

import { MessageCircle } from "lucide-react";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

interface Comment {
  _id: string;
  comment: string;
  createdAt: string;
  userId: {
    _id: string;
    name: string;
    image: string;
  };
}

interface CommentsSectionProps {
  recipeId: string;
  userId: string;
  userImage: string;
  userName: string;
  initialComments: Comment[];
}

export default function CommentsSection({
  recipeId,
  userId,
  userImage,
  userName,
  initialComments,
}: CommentsSectionProps) {
  return (
    <div className="flex flex-col mt-8 w-full">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle size={24} className="text-gray-600 dark:text-gray-400" />
        <h2 className="text-2xl font-semibold">
          Comments ({initialComments.length})
        </h2>
      </div>

      <div className="mb-6">
        <CommentForm
          recipeId={recipeId}
          userId={userId}
          userImage={userImage}
          userName={userName}
        />
      </div>

      <div className="space-y-1">
        {initialComments.length > 0 ? (
          initialComments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              currentUserId={userId}
              recipeId={recipeId}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
}
