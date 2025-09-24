import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function RevenueChart() {
  const chartData = [
    { day: "Mon", percentage: 60 },
    { day: "Tue", percentage: 75 },
    { day: "Wed", percentage: 45 },
    { day: "Thu", percentage: 90 },
    { day: "Fri", percentage: 70 },
    { day: "Sat", percentage: 55 },
    { day: "Sun", percentage: 35 },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle data-testid="text-revenue-chart-title">Revenue Overview</CardTitle>
          <Select defaultValue="7days">
            <SelectTrigger className="w-32" data-testid="select-chart-period">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="3months">Last 3 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-end justify-between space-x-2" data-testid="chart-revenue-bars">
          {chartData.map((data, index) => (
            <div key={data.day} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-primary/20 hover:bg-primary/40 rounded-t transition-colors cursor-pointer"
                style={{ height: `${data.percentage}%` }}
                data-testid={`chart-bar-${data.day.toLowerCase()}`}
              />
              <span className="text-xs text-muted-foreground mt-2">{data.day}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
