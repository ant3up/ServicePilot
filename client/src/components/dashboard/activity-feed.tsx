import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Activity {
  id: string;
  type: "job" | "quote" | "invoice" | "call";
  message: string;
  timestamp: string;
  color: "green" | "blue" | "purple" | "orange" | "red";
}

interface ActivityFeedProps {
  activities: any[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  // Transform activities data or use default
  const defaultActivities: Activity[] = [
    {
      id: "1",
      type: "job",
      message: "Job #1047 completed by Chris Wong",
      timestamp: "Panel upgrade at Greenwood Electric - 2 hours ago",
      color: "green",
    },
    {
      id: "2",
      type: "quote",
      message: "New quote QU-2095 sent to Jamie Lee",
      timestamp: "AC maintenance quote for $420 - 3 hours ago",
      color: "blue",
    },
    {
      id: "3",
      type: "call",
      message: "AI Agent booked job with Priya Patel",
      timestamp: "Heater installation scheduled for tomorrow - 4 hours ago",
      color: "purple",
    },
    {
      id: "4",
      type: "invoice",
      message: "Invoice INV-1028 payment received",
      timestamp: "$2,100 from Marcus Lee - 5 hours ago",
      color: "orange",
    },
    {
      id: "5",
      type: "quote",
      message: "Quote QU-2093 expired",
      timestamp: "Panel upgrade for $3,450 - Follow up needed",
      color: "red",
    },
  ];

  const colorClasses = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    red: "bg-red-500",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle data-testid="text-activity-feed-title">Recent Activity</CardTitle>
          <a href="#" className="text-sm text-primary hover:text-primary/80" data-testid="link-view-all-activity">
            View all
          </a>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {defaultActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3" data-testid={`activity-${activity.id}`}>
              <div className={`w-2 h-2 rounded-full mt-2 ${colorClasses[activity.color]}`} />
              <div className="flex-1">
                <p className="text-sm text-foreground" data-testid={`activity-message-${activity.id}`}>
                  {activity.message}
                </p>
                <p className="text-xs text-muted-foreground" data-testid={`activity-timestamp-${activity.id}`}>
                  {activity.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
