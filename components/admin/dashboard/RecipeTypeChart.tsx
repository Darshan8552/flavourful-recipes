"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'


interface RecipeTypeChartProps {
  data: {
    veg: number
    nonVeg: number
  }
}

const RecipeTypeChart: React.FC<RecipeTypeChartProps> = ({ data }) => {
  const chartData = [
    {
      name: 'Vegetarian',
      value: data.veg,
      color: '#22c55e'
    },
    {
      name: 'Non-Vegetarian',
      value: data.nonVeg,
      color: '#ef4444'
    }
  ]

  const total = data.veg + data.nonVeg

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recipe Types Distribution</CardTitle>
        <CardDescription>
          Breakdown of published recipes by dietary preference
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value} recipes`, 'Count']}
                labelFormatter={(label) => `${label} Recipes`}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{data.veg}</div>
            <div className="text-sm text-gray-600">
              Vegetarian ({total > 0 ? Math.round((data.veg / total) * 100) : 0}%)
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{data.nonVeg}</div>
            <div className="text-sm text-gray-600">
              Non-Veg ({total > 0 ? Math.round((data.nonVeg / total) * 100) : 0}%)
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default RecipeTypeChart