import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, ChevronLeft, ChevronRight, Clock, User, MapPin } from "lucide-react";

export default function Scheduling() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day");

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["/api/jobs"],
  });

  const { data: technicians } = useQuery({
    queryKey: ["/api/users"],
  });

  // Mock schedule data for demonstration
  const scheduleData = [
    {
      id: "1047",
      title: "Panel Upgrade",
      customer: "Chris Wong",
      time: "9:00 - 11:00",
      technician: "Chris Wong",
      address: "214 Oak Street, Greenwood",
      status: "scheduled",
      amount: "$960.00"
    },
    {
      id: "1052",
      title: "AC Maintenance",
      customer: "Jamie Lee",
      time: "1:00 - 2:00",
      technician: "Jamie Lee",
      address: "567 Pine Avenue, Downtown",
      status: "unassigned",
      amount: "$420.00"
    },
    {
      id: "1050",
      title: "Wiring Fix",
      customer: "Chris Wong",
      time: "8:00 - 9:30",
      technician: "Chris Wong",
      address: "345 Main Street",
      status: "scheduled",
      amount: "$280.00"
    },
    {
      id: "1053",
      title: "Heater Install",
      customer: "Jamie Lee",
      time: "10:30 - 12:30",
      technician: "Jamie Lee",
      address: "891 Maple Drive, Riverside",
      status: "scheduled",
      amount: "$2,180.00"
    },
    {
      id: "1041",
      title: "Leak Repair",
      customer: "Priya Patel",
      time: "12:00 - 1:30",
      technician: "Priya Patel",
      address: "123 Oak Avenue",
      status: "in_progress",
      amount: "$450.00"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-green-100 text-green-800";
      case "unassigned":
        return "bg-orange-100 text-orange-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const timeSlots = [
    "8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"
  ];

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">
                  Scheduling
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage technician schedules and job assignments.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" data-testid="button-today">Today</Button>
                <Button data-testid="button-new-job">New Job</Button>
                <Button variant="secondary" data-testid="button-save-schedule">Save Schedule</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Filters Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Filters</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Date</label>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        data-testid="button-date-picker"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Tue, Apr 12
                      </Button>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Teams</label>
                      <Select defaultValue="all">
                        <SelectTrigger data-testid="select-teams">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All teams</SelectItem>
                          <SelectItem value="electrical">Electrical</SelectItem>
                          <SelectItem value="hvac">HVAC</SelectItem>
                          <SelectItem value="plumbing">Plumbing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Status</label>
                      <Select defaultValue="all">
                        <SelectTrigger data-testid="select-status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All statuses</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Technicians</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face" />
                          <AvatarFallback>CW</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Chris Wong</p>
                          <p className="text-xs text-muted-foreground">3 jobs</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b25fcaaa?w=32&h=32&fit=crop&crop=face" />
                          <AvatarFallback>JL</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Jamie Lee</p>
                          <p className="text-xs text-muted-foreground">2 jobs</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=32&h=32&fit=crop&crop=face" />
                          <AvatarFallback>PP</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Priya Patel</p>
                          <p className="text-xs text-muted-foreground">1 job</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Schedule View */}
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" data-testid="button-prev">
                          <ChevronLeft className="w-4 h-4" />
                          Prev
                        </Button>
                        <Button variant="ghost" size="sm" data-testid="button-next">
                          Next
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant={viewMode === "day" ? "default" : "outline"}
                          onClick={() => setViewMode("day")}
                          data-testid="button-day-view"
                        >
                          Day
                        </Button>
                        <Button 
                          size="sm" 
                          variant={viewMode === "week" ? "default" : "outline"}
                          onClick={() => setViewMode("week")}
                          data-testid="button-week-view"
                        >
                          Week
                        </Button>
                        <Button 
                          size="sm" 
                          variant={viewMode === "month" ? "default" : "outline"}
                          onClick={() => setViewMode("month")}
                          data-testid="button-month-view"
                        >
                          Month
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-12 gap-4">
                      {/* Time Column */}
                      <div className="col-span-2 space-y-16">
                        {timeSlots.map((time) => (
                          <div key={time} className="text-sm text-muted-foreground text-right pr-2">
                            {time}
                          </div>
                        ))}
                      </div>

                      {/* Schedule Column */}
                      <div className="col-span-10 space-y-4">
                        {scheduleData.map((job) => (
                          <Card key={job.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow" data-testid={`schedule-job-${job.id}`}>
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3">
                                <Badge className={getStatusColor(job.status)} data-testid={`job-status-${job.id}`}>
                                  {job.status.replace('_', ' ')}
                                </Badge>
                                <div>
                                  <h4 className="font-medium text-foreground" data-testid={`job-title-${job.id}`}>
                                    #{job.id} — {job.title}
                                  </h4>
                                  <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                                    <div className="flex items-center space-x-1">
                                      <Clock className="w-3 h-3" />
                                      <span data-testid={`job-time-${job.id}`}>{job.time}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <User className="w-3 h-3" />
                                      <span data-testid={`job-technician-${job.id}`}>{job.technician}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-1 mt-1 text-sm text-muted-foreground">
                                    <MapPin className="w-3 h-3" />
                                    <span data-testid={`job-address-${job.id}`}>{job.address}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-foreground" data-testid={`job-amount-${job.id}`}>
                                  {job.amount}
                                </p>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between mt-6">
                  <Button variant="outline" data-testid="button-export">Export</Button>
                  <div className="flex items-center space-x-3">
                    <Button variant="outline" data-testid="button-block-time">Block Time</Button>
                    <Button data-testid="button-apply-changes">Apply Changes</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
