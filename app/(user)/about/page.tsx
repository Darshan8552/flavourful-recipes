import { Noto_Sans } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Heart, Users, Target, Award, ChefHat, Globe } from "lucide-react";
import FooterHome from "@/components/footer-home";
import Link from "next/link";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-noto-sans",
});

export default function About() {
  return (
    <section
      className={`flex flex-col w-full min-h-screen bg-[#F9FAFB] dark:bg-[#0F0F0F] ${notoSans.variable}`}
    >
      <section className="relative w-full bg-gradient-to-br from-[#16A34A] to-[#15803D] dark:from-[#22C55E] dark:to-[#16A34A]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="py-16 sm:py-24 lg:py-32 text-center">
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black dark:text-white leading-tight tracking-tight">
                About FlavourFul Recipes
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl dark:text-white/90 max-w-3xl mx-auto leading-relaxed">
                Where passion meets flavor, and every recipe tells a story worth
                sharing.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col items-center justify-center w-full max-w-[1100px] mx-auto my-8 sm:my-12 px-4 space-y-12 sm:space-y-16">
        <div className="flex flex-col justify-between w-full space-y-4">
          <h2 className="text-[#111827] dark:text-[#F4F4F5] text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-[-0.015em] text-center mb-8 sm:mb-12">
            Our Story
          </h2>
          <div className="bg-[#FFFFFF] dark:bg-[#1A1A1A] rounded-xl border border-[#E5E7EB] dark:border-[#2D2D2D] p-6 sm:p-8 lg:p-12">
            <div className="prose prose-lg max-w-none">
              <p className="text-[#4B5563] dark:text-[#A1A1AA] text-base sm:text-lg leading-relaxed mb-6">
                FlavourFul Recipes was born from a simple belief: that great
                food brings people together, and every home cook has a story
                worth sharing. Founded in 2024, we started as a small community
                of food enthusiasts who believed that the best recipes come from
                real kitchens, real families, and real experiences.
              </p>
              <p className="text-[#4B5563] dark:text-[#A1A1AA] text-base sm:text-lg leading-relaxed mb-6">
                What began as a weekend project between friends has grown into a
                thriving platform where thousands of home cooks share their
                culinary adventures. We&apos;ve watched grandmothers pass down
                century-old family recipes, seen college students master their
                first homemade meals, and witnessed professional chefs share
                their simplified techniques for everyday cooking.
              </p>
              <p className="text-[#4B5563] dark:text-[#A1A1AA] text-base sm:text-lg leading-relaxed">
                Today, FlavourFul Recipes is more than just a recipe platform –
                it&apos;s a community where food lovers connect, learn, and
                celebrate the joy of cooking together. Every recipe shared,
                every tip exchanged, and every success story adds another
                brushstroke to our collective FlavourFul Recipes.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between w-full space-y-4 mt-4">
          <h2 className="text-[#111827] dark:text-[#F4F4F5] text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-[-0.015em] text-center mb-8 sm:mb-12">
            Our Mission
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-[#FFFFFF] dark:bg-[#1A1A1A] rounded-xl border border-[#E5E7EB] dark:border-[#2D2D2D] p-6 sm:p-8 flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#16A34A] dark:bg-[#22C55E] rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-[#111827] dark:text-[#F4F4F5] text-xl font-bold">
                  Democratize Cooking
                </h3>
              </div>
              <p className="text-[#4B5563] dark:text-[#A1A1AA] text-base leading-relaxed">
                We believe that great cooking shouldn&apos;t be limited to
                professional kitchens. Our mission is to make quality recipes
                accessible to everyone, regardless of skill level or background.
              </p>
            </div>
            <div className="bg-[#FFFFFF] dark:bg-[#1A1A1A] rounded-xl border border-[#E5E7EB] dark:border-[#2D2D2D] p-6 sm:p-8 flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#FB923C] dark:bg-[#F97316] rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-[#111827] dark:text-[#F4F4F5] text-xl font-bold">
                  Build Community
                </h3>
              </div>
              <p className="text-[#4B5563] dark:text-[#A1A1AA] text-base leading-relaxed">
                Food is a universal language that connects us all. We&apos;re
                building a global community where cultures meet, traditions are
                shared, and new friendships are forged over shared meals.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between w-full space-y-4 mt-4">
          <h2 className="text-[#111827] dark:text-[#F4F4F5] text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-[-0.015em] text-center mb-8 sm:mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-[#FFFFFF] dark:bg-[#1A1A1A] rounded-xl border border-[#E5E7EB] dark:border-[#2D2D2D] p-6 text-center hover:shadow-lg transition-shadow duration-200">
              <div className="w-16 h-16 bg-[#16A34A] dark:bg-[#22C55E] rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-[#111827] dark:text-[#F4F4F5] text-lg font-bold mb-3">
                Authenticity
              </h3>
              <p className="text-[#4B5563] dark:text-[#A1A1AA] text-sm leading-relaxed">
                We celebrate real recipes from real people. Every dish has a
                story, and we honor the authentic experiences behind each
                recipe.
              </p>
            </div>
            <div className="bg-[#FFFFFF] dark:bg-[#1A1A1A] rounded-xl border border-[#E5E7EB] dark:border-[#2D2D2D] p-6 text-center hover:shadow-lg transition-shadow duration-200">
              <div className="w-16 h-16 bg-[#FB923C] dark:bg-[#F97316] rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-[#111827] dark:text-[#F4F4F5] text-lg font-bold mb-3">
                Quality
              </h3>
              <p className="text-[#4B5563] dark:text-[#A1A1AA] text-sm leading-relaxed">
                We maintain high standards for all recipes shared on our
                platform, ensuring clear instructions and tested results.
              </p>
            </div>
            <div className="bg-[#FFFFFF] dark:bg-[#1A1A1A] rounded-xl border border-[#E5E7EB] dark:border-[#2D2D2D] p-6 text-center hover:shadow-lg transition-shadow duration-200">
              <div className="w-16 h-16 bg-[#0EA5E9] dark:bg-[#38BDF8] rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-[#111827] dark:text-[#F4F4F5] text-lg font-bold mb-3">
                Inclusivity
              </h3>
              <p className="text-[#4B5563] dark:text-[#A1A1AA] text-sm leading-relaxed">
                Our platform welcomes cooks from all backgrounds, dietary
                preferences, and skill levels. Everyone has something valuable
                to contribute.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between w-full space-y-4 mt-4">
          <h2 className="text-[#111827] dark:text-[#F4F4F5] text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-[-0.015em] text-center mb-8 sm:mb-12">
            Meet Our Team
          </h2>
          <div className="bg-[#FFFFFF] dark:bg-[#1A1A1A] rounded-xl border border-[#E5E7EB] dark:border-[#2D2D2D] p-6 sm:p-8 lg:p-12">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-[#16A34A] to-[#15803D] dark:from-[#22C55E] dark:to-[#16A34A] rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-[#111827] dark:text-[#F4F4F5] text-xl font-bold mb-2">
                A Passionate Team of Food Lovers
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="text-center">
                <h4 className="text-[#111827] dark:text-[#F4F4F5] text-lg font-semibold mb-2">
                  Development Team
                </h4>
                <p className="text-[#4B5563] dark:text-[#A1A1AA] text-sm leading-relaxed">
                  Our talented developers work tirelessly to create the best
                  user experience, ensuring our platform is fast, reliable, and
                  intuitive for every home cook.
                </p>
              </div>
              <div className="text-center">
                <h4 className="text-[#111827] dark:text-[#F4F4F5] text-lg font-semibold mb-2">
                  Content Curators
                </h4>
                <p className="text-[#4B5563] dark:text-[#A1A1AA] text-sm leading-relaxed">
                  Our culinary experts review and curate recipes, ensuring
                  quality and accuracy while maintaining the authentic voice of
                  each contributor.
                </p>
              </div>
              <div className="text-center">
                <h4 className="text-[#111827] dark:text-[#F4F4F5] text-lg font-semibold mb-2">
                  Community Managers
                </h4>
                <p className="text-[#4B5563] dark:text-[#A1A1AA] text-sm leading-relaxed">
                  Our community team fosters connections between members,
                  moderates discussions, and helps create a welcoming
                  environment for all skill levels.
                </p>
              </div>
              <div className="text-center">
                <h4 className="text-[#111827] dark:text-[#F4F4F5] text-lg font-semibold mb-2">
                  Design Team
                </h4>
                <p className="text-[#4B5563] dark:text-[#A1A1AA] text-sm leading-relaxed">
                  Our designers craft beautiful, functional interfaces that make
                  browsing recipes and sharing culinary creations a delightful
                  experience.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between w-full space-y-4 mt-4">
          <h2 className="text-[#111827] dark:text-[#F4F4F5] text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-[-0.015em] text-center mb-8 sm:mb-12">
            By the Numbers
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-[#FFFFFF] dark:bg-[#1A1A1A] rounded-xl border border-[#E5E7EB] dark:border-[#2D2D2D] p-6 text-center">
              <div className="text-3xl sm:text-4xl font-black text-[#16A34A] dark:text-[#22C55E] mb-2">
                10K+
              </div>
              <p className="text-[#4B5563] dark:text-[#A1A1AA] text-sm font-medium">
                Recipes Shared
              </p>
            </div>
            <div className="bg-[#FFFFFF] dark:bg-[#1A1A1A] rounded-xl border border-[#E5E7EB] dark:border-[#2D2D2D] p-6 text-center">
              <div className="text-3xl sm:text-4xl font-black text-[#FB923C] dark:text-[#F97316] mb-2">
                50K+
              </div>
              <p className="text-[#4B5563] dark:text-[#A1A1AA] text-sm font-medium">
                Active Cooks
              </p>
            </div>
            <div className="bg-[#FFFFFF] dark:bg-[#1A1A1A] rounded-xl border border-[#E5E7EB] dark:border-[#2D2D2D] p-6 text-center">
              <div className="text-3xl sm:text-4xl font-black text-[#0EA5E9] dark:text-[#38BDF8] mb-2">
                100+
              </div>
              <p className="text-[#4B5563] dark:text-[#A1A1AA] text-sm font-medium">
                Countries
              </p>
            </div>
            <div className="bg-[#FFFFFF] dark:bg-[#1A1A1A] rounded-xl border border-[#E5E7EB] dark:border-[#2D2D2D] p-6 text-center">
              <div className="text-3xl sm:text-4xl font-black text-[#16A34A] dark:text-[#22C55E] mb-2">
                1M+
              </div>
              <p className="text-[#4B5563] dark:text-[#A1A1AA] text-sm font-medium">
                Meals Cooked
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between w-full space-y-4 mt-4">
          <h2 className="text-[#111827] dark:text-[#F4F4F5] text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-[-0.015em] text-center mb-8 sm:mb-12">
            Get in Touch
          </h2>
          <div className="bg-[#FFFFFF] dark:bg-[#1A1A1A] rounded-xl border border-[#E5E7EB] dark:border-[#2D2D2D] p-6 sm:p-8 lg:p-12 text-center">
            <p className="text-[#4B5563] dark:text-[#A1A1AA] text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              Have questions, suggestions, or just want to share your cooking
              success story? We&apos;d love to hear from you! Our team is always
              excited to connect with fellow food enthusiasts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto mt-2">
              <Button
                asChild
                size="lg"
                className="bg-[#16A34A] hover:bg-[#15803D] dark:bg-[#22C55E] dark:hover:bg-[#16A34A] text-white font-bold w-full sm:w-auto"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-[#E5E7EB] dark:border-[#2D2D2D] text-[#111827] dark:text-[#F4F4F5] hover:bg-[#F9FAFB] dark:hover:bg-[#1A1A1A] w-full sm:w-auto"
              >
                <Link href="/recipes">Browse Recipes</Link>
              </Button>
            </div>
          </div>
        </div>

        <FooterHome />
      </div>
    </section>
  );
}
