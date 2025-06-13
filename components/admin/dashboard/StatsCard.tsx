import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: "blue" | "green" | "purple" | "orange" | "red";
  description?: string;
}

const colorClasses = {
  blue: "bg-blue-50 text-blue-600 border-blue-200",
  green: "bg-green-50 text-green-600 border-green-200",
  purple: "bg-purple-50 text-purple-600 border-purple-200",
  orange: "bg-orange-50 text-orange-600 border-orange-200",
  red: "bg-red-50 text-red-600 border-red-200",
};

const iconClasses = {
  blue: "text-blue-600",
  green: "text-green-600",
  purple: "text-purple-600",
  orange: "text-orange-600",
  red: "text-red-600",
};

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  description,
}) => {
  return (
    <Card
      className={`transition-all duration-200 hover:shadow-lg ${colorClasses[color]}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700">
          {title}
        </CardTitle>
        <Icon className={`h-5 w-5 ${iconClasses[color]}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">
          {value.toLocaleString()}
        </div>
        {description && (
          <p className="text-xs text-gray-600 mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
