import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Job {
  id: string;
  jobNumber: string;
  title: string;
  status: string;
  startTime: string;
  endTime: string;
  totalAmount: string;
  customerName?: string;
  address?: string;
  technicianName?: string;
  technicianImage?: string;
}

interface ScheduleListProps {
  jobs: Job[];
}

export function ScheduleList({ jobs }: ScheduleListProps) {
  // Default schedule data
  const defaultSchedule = [
    {
      id: "1",
      jobNumber: "#1047",
      title: "Panel Upgrade",
      status: "Scheduled",
      startTime: "9:00 AM",
      endTime: "11:00 AM",
      totalAmount: "$960.00",
      customerName: "Chris Wong",
      address: "214 Oak Street, Greenwood",
      technicianName: "Chris Wong",
      technicianImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
    },
    {
      id: "2",
      jobNumber: "#1052",
      title: "AC Maintenance",
      status: "Pending",
      startTime: "1:00 PM",
      endTime: "3:00 PM",
      totalAmount: "$420.00",
      customerName: "Jamie Lee",
      address: "567 Pine Avenue, Downtown",
      technicianName: "Jamie Lee",
      technicianImage: "https://images.unsplash.com/photo-1494790108755-2616b25fcaaa?w=32&h=32&fit=crop&crop=face",
    },
    {
      id: "3",
      jobNumber: "#1053",
      title: "Heater Install",
      status: "In Progress",
      startTime: "4:00 PM",
      endTime: "6:00 PM",
      totalAmount: "$2,180.00",
      customerName: "Priya Patel",
      address: "891 Maple Drive, Riverside",
      technicianName: "Priya Patel",
      technicianImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=32&h=32&fit=crop&crop=face",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle data-testid="text-schedule-title">Today's Schedule</CardTitle>
          <a href="/scheduling" className="text-sm text-primary hover:text-primary/80" data-testid="link-view-calendar">
            View full calendar
          </a>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {defaultSchedule.map((job) => (
            <div 
              key={job.id} 
              className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg"
              data-testid={`schedule-item-${job.id}`}
            >
              <div className="text-center min-w-0">
                <div className="text-sm font-medium text-foreground" data-testid={`job-start-time-${job.id}`}>
                  {job.startTime}
                </div>
                <div className="text-xs text-muted-foreground" data-testid={`job-end-time-${job.id}`}>
                  {job.endTime}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Badge 
                    className={getStatusColor(job.status)}
                    data-testid={`job-status-${job.id}`}
                  >
                    {job.status}
                  </Badge>
                  <span className="text-sm font-medium text-foreground" data-testid={`job-title-${job.id}`}>
                    {job.jobNumber} - {job.title}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground" data-testid={`job-details-${job.id}`}>
                  {job.customerName} • {job.address}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-foreground" data-testid={`job-amount-${job.id}`}>
                  {job.totalAmount}
                </div>
                <Avatar className="w-6 h-6 mt-1">
                  <AvatarImage src={job.technicianImage} alt={job.technicianName} />
                  <AvatarFallback className="text-xs">
                    {job.technicianName?.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
