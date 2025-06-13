'use client';

import { toggleLike } from '@/actions/like-action';
import { Heart } from 'lucide-react';
import { useState, useTransition } from 'react';

interface LikeButtonProps {
  recipeId: string;
  userId: string;
  initialLikeCount: number;
  initialIsLiked: boolean;
}

export default function LikeButton({ 
  recipeId, 
  userId, 
  initialLikeCount, 
  initialIsLiked 
}: LikeButtonProps) {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isPending, startTransition] = useTransition();

  const handleLike = () => {
    // Optimistic update
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);

    startTransition(async () => {
      try {
        const result = await toggleLike(recipeId, userId);
        
        // Update with actual values from server
        setLikeCount(result.likeCount);
        setIsLiked(result.isLiked);
      } catch (error) {
        // Revert optimistic update on error
        setIsLiked(isLiked);
        setLikeCount(initialLikeCount);
        console.error('Failed to toggle like:', error);
      }
    });
  };

  return (
    <button
      onClick={handleLike}
      disabled={isPending}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 ${
        isLiked
          ? 'bg-red-500 text-white border-red-500 hover:bg-red-600'
          : 'bg-transparent border-gray-300 hover:border-red-500 hover:text-red-500'
      } ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <Heart
        size={20}
        className={`transition-all duration-200 ${
          isLiked ? 'fill-current' : 'fill-none'
        }`}
      />
      <span className="text-sm font-medium">
        {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
      </span>
    </button>
  );
}