'use client';

import { Bookmark } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toggleSave } from '@/actions/like-action';

interface BookmarkButtonProps {
  recipeId: string;
  userId: string;
  initialIsSaved: boolean;
}

export default function BookmarkButton({ 
  recipeId, 
  userId, 
  initialIsSaved 
}: BookmarkButtonProps) {
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    // Optimistic update
    setIsSaved(!isSaved);

    startTransition(async () => {
      try {
        const result = await toggleSave(recipeId, userId);
        
        // Update with actual values from server
        setIsSaved(result.isSaved);
      } catch (error) {
        // Revert optimistic update on error
        setIsSaved(initialIsSaved);
        console.error('Failed to toggle save:', error);
      }
    });
  };

  return (
    <button
      onClick={handleSave}
      disabled={isPending}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 ${
        isSaved
          ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
          : 'bg-transparent border-gray-300 hover:border-blue-500 hover:text-blue-500'
      } ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <Bookmark
        size={20}
        className={`transition-all duration-200 ${
          isSaved ? 'fill-current' : 'fill-none'
        }`}
      />
      <span className="text-sm font-medium">
        {isSaved ? 'Saved' : 'Save'}
      </span>
    </button>
  );
}