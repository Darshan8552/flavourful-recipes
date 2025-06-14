import Image from "next/image";
import { Noto_Sans } from "next/font/google";
import { getRecipesForLandingPage } from "@/actions/recipes-action";
import { Button } from "@/components/ui/button";
import { Check, CookingPot, Moon } from "lucide-react";
import FooterHome from "@/components/footer-home";
import Link from "next/link";
import { formatMinutes } from "@/lib/generate-otp";
import { getSession } from "@/lib/auth/auth";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-noto-sans",
});

export default async function Home() {
  const recipes = await getRecipesForLandingPage();
  const session = await getSession();

  return (
    <section
      className={`flex flex-col w-full min-h-screen bg-[#F9FAFB] dark:bg-[#0F0F0F] ${notoSans.variable}`}
    >
      <section className="relative w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="relative mt-4 sm:mt-10 rounded-xl overflow-hidden min-h-[400px] sm:min-h-[520px] lg:min-h-[600px]">
            <Image
              src="https://ik.imagekit.io/4kojujvb7/spices-herbs-salt-paprika-copy-space-top-view-banner-flat-lay_1200200-16725.avif?updatedAt=1749896913995"
              alt="Delicious recipes showcase"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <div className="max-w-4xl space-y-4 sm:space-y-6">
                <h1 className="text-2xl sm:text-4xl lg:text-6xl xl:text-7xl font-black text-white leading-tight tracking-tight">
                  Cook, Share & Discover Recipes
                </h1>
                <p className="text-sm sm:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                  A modern recipe blog where you can explore and publish your
                  favorite dishes.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-12 w-full max-w-md sm:max-w-lg items-center justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#16A34A] hover:bg-[#15803D] dark:bg-[#22C55E] dark:hover:bg-[#16A34A] text-white font-bold w-full max-w-[280px] sm:max-w-[400px]"
                >
                  <Link href="/recipes">Explore Recipes</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="w-full max-w-[280px] sm:max-w-[400px] bg-white hover:bg-gray-100 dark:bg-[#1A1A1A] dark:hover:bg-[#2D2D2D] text-[#111827] dark:text-[#F4F4F5] font-bold border border-[#E5E7EB] dark:border-[#2D2D2D]"
                >
                  <Link href={session ? "/user-upload-recipe" : "/signup"}>
                    {session ? "Upload Recipe" : "Sign Up"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col items-center justify-center w-full max-w-[1100px] mx-auto my-6 sm:my-10 px-4">
        <div className="flex gap-2 sm:gap-3 p-3 flex-wrap justify-center">
          <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#1A1A1A] dark:bg-[#1A1A1A] pl-3 pr-3 sm:pl-4 sm:pr-4">
            <p className="text-white text-xs sm:text-sm font-medium leading-normal">
              Quick &amp; Easy
            </p>
          </div>
          <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#1A1A1A] dark:bg-[#1A1A1A] pl-3 pr-3 sm:pl-4 sm:pr-4">
            <p className="text-[#F4F4F5] text-xs sm:text-sm font-medium leading-normal">
              Vegetarian
            </p>
          </div>
          <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#1A1A1A] dark:bg-[#1A1A1A] pl-3 pr-3 sm:pl-4 sm:pr-4">
            <p className="text-[#F4F4F5] text-xs sm:text-sm font-medium leading-normal">
              Desserts
            </p>
          </div>
          <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#1A1A1A] dark:bg-[#1A1A1A] pl-3 pr-3 sm:pl-4 sm:pr-4">
            <p className="text-[#F4F4F5] text-xs sm:text-sm font-medium leading-normal">
              Weeknight Dinners
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between w-full max-w-[1100px] mx-auto">
          <h2 className="text-[#111827] dark:text-[#F4F4F5] text-lg sm:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
            Featured Recipes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
            {(recipes ?? []).map((recipe) => (
              <Link
                href={`/recipes/${recipe._id}`}
                key={recipe._id}
                className="flex flex-col justify-center p-3 sm:p-4 space-y-2 bg-[#FFFFFF] dark:bg-[#1A1A1A] shadow-lg rounded-lg hover:scale-102 border border-[#E5E7EB] dark:border-[#2D2D2D] transition-transform duration-200"
              >
                <div className="relative flex flex-col aspect-video rounded-lg overflow-hidden mb-3">
                  <Image
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
                <h3 className="text-[#111827] dark:text-[#F4F4F5] text-sm sm:text-base font-medium leading-normal">
                  {recipe.title}
                </h3>
                <p className="text-[#4B5563] dark:text-[#A1A1AA] text-xs font-normal leading-normal">
                  Difficulty:{" "}
                  {recipe.difficulty.replace(/\b\w/g, (char) =>
                    char.toUpperCase()
                  )}{" "}
                  | Time: {formatMinutes(recipe.cookingTime)} | Type:{" "}
                  {recipe.type === "veg" ? "Vegetarian" : "Non-Vegetarian"}
                </p>
              </Link>
            ))}
          </div>
          <div className="flex items-center justify-center w-full mt-6">
            <Link href="/recipes" className="cursor-pointer hover:scale-105">
              <Button 
                variant="outline"
                className="border-[#E5E7EB] dark:border-[#2D2D2D] text-[#111827] dark:text-[#F4F4F5] hover:bg-[#F9FAFB] dark:hover:bg-[#1A1A1A] "
              >
                <span className="truncate">View All Recipes</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col justify-between w-full max-w-[1100px] mx-auto">
          <h2 className="text-[#111827] dark:text-[#F4F4F5] text-lg sm:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
            Why Choose FlavourFul Recipes?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
            <div className="flex gap-3 rounded-lg border border-[#E5E7EB] dark:border-[#2D2D2D] bg-[#FFFFFF] dark:bg-[#1A1A1A] p-4 flex-col transition-colors duration-200">
              <div className="text-[#16A34A] dark:text-[#22C55E]">
                <CookingPot size={24} />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-[#111827] dark:text-[#F4F4F5] text-base font-bold leading-tight">
                  Easy to Use
                </h2>
                <p className="text-[#4B5563] dark:text-[#A1A1AA] text-sm font-normal leading-normal">
                  Our intuitive interface makes finding and sharing recipes a
                  breeze.
                </p>
              </div>
            </div>
            <div className="flex gap-3 rounded-lg border border-[#E5E7EB] dark:border-[#2D2D2D] bg-[#FFFFFF] dark:bg-[#1A1A1A] p-4 flex-col transition-colors duration-200">
              <div className="text-[#16A34A] dark:text-[#22C55E]">
                <Check size={24} />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-[#111827] dark:text-[#F4F4F5] text-base font-bold leading-tight">
                  Verified Recipes
                </h2>
                <p className="text-[#4B5563] dark:text-[#A1A1AA] text-sm font-normal leading-normal">
                  All recipes are carefully reviewed for accuracy and quality.
                </p>
              </div>
            </div>
            <div className="flex gap-3 rounded-lg border border-[#E5E7EB] dark:border-[#2D2D2D] bg-[#FFFFFF] dark:bg-[#1A1A1A] p-4 flex-col transition-colors duration-200">
              <div className="text-[#16A34A] dark:text-[#22C55E]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24px"
                  height="24px"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"></path>
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-[#111827] dark:text-[#F4F4F5] text-base font-bold leading-tight">
                  Community Driven
                </h2>
                <p className="text-[#4B5563] dark:text-[#A1A1AA] text-sm font-normal leading-normal">
                  Connect with other food lovers and share your FlavourFul Recipes
                  creations.
                </p>
              </div>
            </div>
            <div className="flex gap-3 rounded-lg border border-[#E5E7EB] dark:border-[#2D2D2D] bg-[#FFFFFF] dark:bg-[#1A1A1A] p-4 flex-col transition-colors duration-200">
              <div className="text-[#16A34A] dark:text-[#22C55E]">
                <Moon size={24} />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-[#111827] dark:text-[#F4F4F5] text-base font-bold leading-tight">
                  Dark Mode Friendly
                </h2>
                <p className="text-[#4B5563] dark:text-[#A1A1AA] text-sm font-normal leading-normal">
                  Enjoy a comfortable browsing experience, day or night.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between w-full max-w-[1100px] mx-auto">
          <h2 className="text-[#111827] dark:text-[#F4F4F5] text-lg sm:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
            Top Recipe Categories
          </h2>
          <div className="flex gap-2 sm:gap-3 p-3 flex-wrap justify-center">
            {[
              "Breakfast",
              "Lunch",
              "Dinner",
              "Desserts",
              "Appetizers",
              "Salads",
              "Soups",
              "Drinks",
              "Baking",
              "Grilling",
            ].map((category) => (
              <div
                key={category}
                className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#1A1A1A] dark:bg-[#1A1A1A] border border-[#E5E7EB] dark:border-[#2D2D2D] pl-3 pr-3 sm:pl-4 sm:pr-4 hover:bg-[#345637] hover:scale-105 dark:hover:bg-[#2D2D2D] transition-colors duration-200 cursor-pointer"
              >
                <p className="text-[#F4F4F5] text-xs sm:text-sm font-medium leading-normal">
                  {category}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between w-full max-w-[1100px] mx-auto">
          <h2 className="text-[#111827] dark:text-[#F4F4F5] text-lg sm:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
            What Our Users Say
          </h2>
          <div className="flex w-full relative overflow-hidden h-[250px] sm:h-[350px] rounded-xl mx-auto border border-[#E5E7EB] dark:border-[#2D2D2D]">
            <Image
              src="https://ik.imagekit.io/4kojujvb7/user-review.png?updatedAt=1748741325098"
              alt="user review"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute flex w-full items-end justify-between gap-4 p-4 sm:p-6 bottom-0">
              <div className="flex max-w-full sm:max-w-[440px] flex-1 flex-col gap-1">
                <p className="text-white tracking-light text-lg sm:text-2xl lg:text-3xl font-bold leading-tight">
                  &quot;FlavourFul Recipes has transformed my cooking! I&apos;ve
                  discovered so many new dishes and connected with amazing home
                  cooks.&quot;
                </p>
                <p className="text-white text-sm sm:text-md font-medium leading-normal">
                  - Sophia Carter
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center space-y-6 sm:space-y-10 justify-between w-full max-w-[1100px] mx-auto mt-8 sm:mt-12 px-4">
          <h1 className="text-[#111827] dark:text-[#F4F4F5] tracking-light text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-center">
            Explore thousands of food Recipes today!
          </h1>
          <div className="flex flex-1 justify-center w-full">
            <div className="flex justify-center w-full max-w-md">
              <div className="flex flex-col items-center sm:flex-row gap-3 w-full justify-center">
                <Link href="/signup">
                  <button className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 md:h-12 md:px-5 bg-[#16A34A] hover:bg-[#15803D] dark:bg-[#22C55E] dark:hover:bg-[#16A34A] text-white text-sm font-bold leading-normal tracking-[0.015em] md:text-base md:font-bold md:leading-normal md:tracking-[0.015em] flex-1 sm:flex-none sm:min-w-[140px] transition-colors duration-200">
                    <span className="truncate">Sign Up</span>
                  </button>
                </Link>
                <Link href="/recipes">
                  <button className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 md:h-12 md:px-5 bg-[#FFFFFF] hover:bg-[#F9FAFB] dark:bg-[#1A1A1A] dark:hover:bg-[#2D2D2D] text-[#111827] dark:text-[#F4F4F5] border border-[#E5E7EB] dark:border-[#2D2D2D] text-sm font-bold leading-normal tracking-[0.015em] md:text-base md:font-bold md:leading-normal md:tracking-[0.015em] flex-1 sm:flex-none sm:min-w-[140px] transition-colors duration-200">
                    <span className="truncate">Browse Recipes</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <FooterHome />
      </div>
    </section>
  );
}