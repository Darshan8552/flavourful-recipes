'use client'
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface DifficultyChartProps {
  data: {
    easy: number
    medium: number
    hard: number
  }
}

const DifficultyChart: React.FC<DifficultyChartProps> = ({ data }) => {
  const chartData = [
    {
      difficulty: 'Easy',
      count: data.easy,
      color: '#22c55e'
    },
    {
      difficulty: 'Medium',
      count: data.medium,
      color: '#f59e0b'
    },
    {
      difficulty: 'Hard',
      count: data.hard,
      color: '#ef4444'
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recipe Difficulty Levels</CardTitle>
        <CardDescription>
          Distribution of recipes by cooking difficulty
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="difficulty" 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                formatter={(value: number) => [`${value}`, 'Recipes']}
                labelFormatter={(label) => `${label} Difficulty`}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="count" 
                radius={[4, 4, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{data.easy}</div>
            <div className="text-sm text-gray-600">Easy Recipes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{data.medium}</div>
            <div className="text-sm text-gray-600">Medium Recipes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{data.hard}</div>
            <div className="text-sm text-gray-600">Hard Recipes</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default DifficultyChart