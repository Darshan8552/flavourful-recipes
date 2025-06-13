'use client'
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface GrowthChartProps {
  userGrowth: Array<{ month: string; count: number }>
  recipeGrowth: Array<{ month: string; count: number }>
}

const GrowthChart: React.FC<GrowthChartProps> = ({ userGrowth, recipeGrowth }) => {
  // Combine the data for the chart
  const combinedData = () => {
    const allMonths = [...new Set([
      ...userGrowth.map(item => item.month),
      ...recipeGrowth.map(item => item.month)
    ])].sort()

    return allMonths.map(month => {
      const userCount = userGrowth.find(item => item.month === month)?.count || 0
      const recipeCount = recipeGrowth.find(item => item.month === month)?.count || 0
      
      return {
        month,
        users: userCount,
        recipes: recipeCount
      }
    })
  }

  const chartData = combinedData()

  return (
    <Card className="col-span-full max-w-xl w-full">
      <CardHeader>
        <CardTitle>Growth Trends</CardTitle>
        <CardDescription>
          Monthly user registrations and recipe publications over the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="month" 
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
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                name="New Users"
              />
              <Line 
                type="monotone" 
                dataKey="recipes" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                name="New Recipes"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-blue-800">Total New Users</h3>
                <p className="text-2xl font-bold text-blue-900">
                  {userGrowth.reduce((sum, item) => sum + item.count, 0)}
                </p>
              </div>
              <div className="text-blue-600">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-green-800">Total New Recipes</h3>
                <p className="text-2xl font-bold text-green-900">
                  {recipeGrowth.reduce((sum, item) => sum + item.count, 0)}
                </p>
              </div>
              <div className="text-green-600">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default GrowthChart