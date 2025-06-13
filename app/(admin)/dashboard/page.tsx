import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  ChefHat,
  MessageSquare,
  Eye,
  Heart,
  TrendingUp,
} from "lucide-react";
import {
  getEngagementStats,
  getMonthlyGrowthStats,
  getRecipeStats,
  getTopRecipes,
  getUserStatsAction,
} from "@/actions/dashboard-stat-action";
import StatsCard from "@/components/admin/dashboard/StatsCard";
import TopRecipesList from "@/components/admin/dashboard/TopRecipesList";
import DifficultyChart from "@/components/admin/dashboard/DifficultyChart";
import RecipeTypeChart from "@/components/admin/dashboard/RecipeTypeChart";
import GrowthChart from "@/components/admin/dashboard/GrowthChart";


const Dashboard = async () => {
  const [userStats, recipeStats, engagementStats, growthStats, topRecipes] =
    await Promise.all([
      getUserStatsAction(),
      getRecipeStats(),
      getEngagementStats(),
      getMonthlyGrowthStats(),
      getTopRecipes(),
    ]);

  return (
    <div className="min-h-screen flex  flex-col w-full space-y-6 mt-6">
        {/* Header */}
        <div className=" space-y-2">
          <h1 className="text-4xl font-bold text-woodsmoke-200">Admin Dashboard</h1>
          <p className="text-woodsmoke-300">
            Monitor your platform&apos;s performance and user engagement
          </p>
        </div>
      <Card className="w-full flex mx-auto space-y-8 p-6">

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Users"
            value={userStats.totalUsers}
            icon={Users}
            color="blue"
            description={`${userStats.verifiedUsers} verified`}
          />
          <StatsCard
            title="Published Recipes"
            value={recipeStats.published}
            icon={ChefHat}
            color="green"
            description={`${recipeStats.drafts} drafts`}
          />
          <StatsCard
            title="Total Comments"
            value={engagementStats.totalComments}
            icon={MessageSquare}
            color="purple"
            description="User interactions"
          />
          <StatsCard
            title="Total Views"
            value={engagementStats.totalViews}
            icon={Eye}
            color="orange"
            description="Recipe page views"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Regular Users</span>
                <Badge variant="secondary">{userStats.regularUsers}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Admin Users</span>
                <Badge variant="destructive">{userStats.adminUsers}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Unverified</span>
                <Badge variant="outline">{userStats.unverifiedUsers}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Engagement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Likes</span>
                <Badge variant="secondary">{engagementStats.totalLikes}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg. Likes/Recipe</span>
                <Badge variant="outline">
                  {recipeStats.published > 0
                    ? Math.round(
                        engagementStats.totalLikes / recipeStats.published
                      )
                    : 0}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg. Views/Recipe</span>
                <Badge variant="outline">
                  {recipeStats.published > 0
                    ? Math.round(
                        engagementStats.totalViews / recipeStats.published
                      )
                    : 0}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Recipes</span>
                <Badge variant="secondary">{recipeStats.total}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Publish Rate</span>
                <Badge variant="outline">
                  {recipeStats.total > 0
                    ? Math.round(
                        (recipeStats.published / recipeStats.total) * 100
                      )
                    : 0}
                  %
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Engagement Rate</span>
                <Badge variant="outline">
                  {engagementStats.totalViews > 0
                    ? Math.round(
                        (engagementStats.totalComments /
                          engagementStats.totalViews) *
                          100
                      )
                    : 0}
                  %
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecipeTypeChart data={recipeStats.byType} />
          <DifficultyChart data={recipeStats.byDifficulty} />
        </div>

        <div className="w-full flex gap-4">
          {/* Growth Chart */}
        <GrowthChart
          userGrowth={growthStats.userGrowth}
          recipeGrowth={growthStats.recipeGrowth}
        />

        {/* Top Recipes */}
        <TopRecipesList recipes={topRecipes} />
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
