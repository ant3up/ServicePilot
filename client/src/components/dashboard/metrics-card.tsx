import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LucideIcon } from "lucide-react";

interface MetricsCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: "green" | "blue" | "orange" | "purple";
  isLoading?: boolean;
}

const colorClasses = {
  green: "bg-green-100 text-green-600",
  blue: "bg-blue-100 text-blue-600",
  orange: "bg-orange-100 text-orange-600",
  purple: "bg-purple-100 text-purple-600",
};

const changeColorClasses = {
  green: "text-green-600",
  blue: "text-blue-600",
  orange: "text-orange-600",
  purple: "text-purple-600",
};

export function MetricsCard({ title, value, change, icon: Icon, color, isLoading }: MetricsCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-12 w-12 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground" data-testid={`text-${title.toLowerCase().replace(/\s+/g, '-')}-title`}>
              {title}
            </p>
            <p className="text-2xl font-bold text-foreground" data-testid={`text-${title.toLowerCase().replace(/\s+/g, '-')}-value`}>
              {value}
            </p>
            <p className={`text-xs mt-1 ${changeColorClasses[color]}`} data-testid={`text-${title.toLowerCase().replace(/\s+/g, '-')}-change`}>
              {change}
            </p>
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
