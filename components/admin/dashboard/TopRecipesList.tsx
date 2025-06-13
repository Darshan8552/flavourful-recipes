import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Eye, Trophy, ChefHat } from 'lucide-react'

interface TopRecipe {
  id: string
  title: string
  likes?: number
  views?: number
}

interface TopRecipesListProps {
  recipes: TopRecipe[]
}

const TopRecipesList: React.FC<TopRecipesListProps> = ({ recipes }) => {
  const getTrophyColor = (index: number) => {
    switch (index) {
      case 0: return 'text-yellow-500'
      case 1: return 'text-gray-400'
      case 2: return 'text-amber-600'
      default: return 'text-gray-300'
    }
  }

  const getRankBadgeVariant = (index: number) => {
    switch (index) {
      case 0: return 'default'
      case 1: return 'secondary'
      case 2: return 'outline'
      default: return 'outline'
    }
  }

  return (
    <Card className='flex w-full'>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Top Performing Recipes
        </CardTitle>
        <CardDescription>
          Most liked and viewed recipes on your platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recipes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ChefHat className="h-12 w-12 mx-auto mb-4 text-woodsmoke-300" />
            <p>No recipes found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recipes.map((recipe, index) => (
              <div
                key={recipe.id}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Trophy className={`h-5 w-5 ${getTrophyColor(index)}`} />
                    <Badge variant={getRankBadgeVariant(index)}>
                      #{index + 1}
                    </Badge>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-woodsmoke-300 text-sm md:text-base">
                      {recipe.title}
                    </h3>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-gray-600">{recipe.likes}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm">
                    <Eye className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-600">{recipe.views}</span>
                  </div>
                  
                  <Badge variant="outline" className="text-xs">
                    {recipe.likes! + recipe.views!} total
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {recipes.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-red-500">
                  {recipes.reduce((sum, recipe) => sum + recipe.likes!, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Likes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-500">
                  {recipes.reduce((sum, recipe) => sum + recipe.views!, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Views</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default TopRecipesList