import Link from "next/link";
import { ChefHat } from "lucide-react";

interface CategoryCardProps {
  category: {
    _id: string;
    name: string;
    slug: string;
    recipeCount: number;
  };
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes("dessert") || name.includes("sweet")) return "🍰";
    if (name.includes("soup")) return "🍲";
    if (name.includes("salad")) return "🥗";
    if (name.includes("breakfast")) return "🍳";
    if (name.includes("dinner") || name.includes("main")) return "🍽️";
    if (name.includes("snack")) return "🍿";
    if (name.includes("drink") || name.includes("beverage")) return "🥤";
    if (name.includes("bread") || name.includes("baking")) return "🍞";
    if (name.includes("pasta")) return "🍝";
    if (name.includes("pizza")) return "🍕";
    return "🍴";
  };

  return (
    <Link href={`/recipes?category=${category._id}`}>
      <div className="group bg-[#1a1a1a] border border-[#2d2d2d] rounded-lg p-6 hover:border-blue-500 hover:bg-[#1f1f1f] transition-all duration-300 cursor-pointer">
        <div className="flex items-center justify-center w-12 h-12 bg-[#2d2d2d] rounded-lg mb-4 group-hover:bg-blue-500 transition-colors duration-300">
          <span className="text-2xl">{getCategoryIcon(category.name)}</span>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">
            {category.name}
          </h3>

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <ChefHat className="w-4 h-4" />
            <span>
              {category.recipeCount}{" "}
              {category.recipeCount === 1 ? "recipe" : "recipes"}
            </span>
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm text-gray-400 group-hover:text-blue-400 transition-colors duration-300">
          <span>View recipes</span>
          <svg
            className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
