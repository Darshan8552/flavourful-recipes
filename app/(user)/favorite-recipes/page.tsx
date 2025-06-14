import FavoriteRecipesContent from "@/components/recipes/favorite-recipes-content";
import { getSession } from "@/lib/auth/auth";
import { Heart, Loader } from "lucide-react";
import React, { Suspense } from "react";

interface FavoriteRecipesPageProps {
  searchParams?: Promise<{
    page?: string;
  }>;
}

const FavoriteRecipesPage = async (props: FavoriteRecipesPageProps) => {
  const searchParams = await props.searchParams;
  const session = await getSession();

  if (!session?.user.id) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen px-10 bg-gray-50 dark:bg-zinc-950">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">
          Please log in to view your favorite recipes
        </h1>
      </div>
    );
  }

  const userId = session.user.id as string;
  const page = searchParams?.page || "1";

  return (
    <main className="flex-col min-h-screen w-full bg-gray-50 dark:bg-zinc-950">
      <div className="flex flex-col w-full px-6 lg:px-10 py-6">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
            Favorite Recipes{" "}
            <Heart className="size-7 text-red-600 dark:text-red-500 fill-red-600 dark:fill-red-500" />
          </h1>
        </div>

        <Suspense
          key={page}
          fallback={
            <div className="flex items-center justify-center w-full h-64">
              <Loader className="animate-spin text-gray-900 dark:text-zinc-100" size={32} />
              <span className="ml-2 text-gray-900 dark:text-zinc-100">
                Loading favorite recipes...
              </span>
            </div>
          }
        >
          <FavoriteRecipesContent
            userId={userId}
            currentPage={parseInt(page)}
          />
        </Suspense>
      </div>
    </main>
  );
};

export default FavoriteRecipesPage;