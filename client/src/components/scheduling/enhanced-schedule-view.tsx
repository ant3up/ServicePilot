import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, ChevronLeft, ChevronRight, Clock, User, MapPin, Plus } from "lucide-react";

interface EnhancedScheduleViewProps {
  selectedDate: Date;
  viewMode: "day" | "week" | "month";
  onViewModeChange: (mode: "day" | "week" | "month") => void;
  onDateChange: (date: Date) => void;
}

export function EnhancedScheduleView({ 
  selectedDate, 
  viewMode, 
  onViewModeChange, 
  onDateChange 
}: EnhancedScheduleViewProps) {
  const { data: jobs } = useQuery({
    queryKey: ["/api/jobs"],
  });

  const { data: technicians } = useQuery({
    queryKey: ["/api/users"],
  });

  // Enhanced schedule data with more details
  const scheduleData = [
    {
      id: "1047",
      jobNumber: "#1047",
      title: "Panel Upgrade",
      customer: "Chris Wong",
      time: "9:00 - 11:00",
      technician: "Chris Wong",
      technicianImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
      address: "214 Oak Street, Greenwood",
      status: "scheduled",
      amount: "$960.00",
      timeSlot: 9
    },
    {
      id: "1050",
      jobNumber: "#1050",
      title: "Wiring Fix",
      customer: "Chris Wong",
      time: "8:00 - 9:30",
      technician: "Chris Wong",
      technicianImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
      address: "345 Main Street",
      status: "scheduled",
      amount: "$280.00",
      timeSlot: 8
    },
    {
      id: "1052",
      jobNumber: "#1052",
      title: "AC Maintenance",
      customer: "Jamie Lee",
      time: "1:00 - 2:00",
      technician: "Jamie Lee",
      technicianImage: "https://images.unsplash.com/photo-1494790108755-2616b25fcaaa?w=32&h=32&fit=crop&crop=face",
      address: "567 Pine Avenue, Downtown",
      status: "unassigned",
      amount: "$420.00",
      timeSlot: 13
    },
    {
      id: "1053",
      jobNumber: "#1053",
      title: "Heater Install",
      customer: "Priya Patel",
      time: "10:30 - 12:30",
      technician: "Jamie Lee",
      technicianImage: "https://images.unsplash.com/photo-1494790108755-2616b25fcaaa?w=32&h=32&fit=crop&crop=face",
      address: "891 Maple Drive, Riverside",
      status: "scheduled",
      amount: "$2,180.00",
      timeSlot: 10
    },
    {
      id: "1041",
      jobNumber: "#1041",
      title: "Leak Repair",
      customer: "Priya Patel",
      time: "12:00 - 1:30",
      technician: "Priya Patel",
      technicianImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=32&h=32&fit=crop&crop=face",
      address: "123 Oak Avenue",
      status: "in_progress",
      amount: "$450.00",
      timeSlot: 12
    }
  ];

  const timeSlots = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-green-100 text-green-800 border-green-200";
      case "unassigned":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatTime = (hour: number) => {
    if (hour === 0) return "12:00 AM";
    if (hour < 12) return `${hour}:00 AM`;
    if (hour === 12) return "12:00 PM";
    return `${hour - 12}:00 PM`;
  };

  const getJobsForTimeSlot = (timeSlot: number) => {
    return scheduleData.filter(job => job.timeSlot === timeSlot);
  };

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    if (direction === "prev") {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    onDateChange(newDate);
  };

  return (
    <div className="space-y-6">
      {/* Schedule Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigateDate("prev")}
                data-testid="button-prev-date"
              >
                <ChevronLeft className="w-4 h-4" />
                Prev
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigateDate("next")}
                data-testid="button-next-date"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
              <h3 className="text-lg font-semibold">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                size="sm" 
                variant={viewMode === "day" ? "default" : "outline"}
                onClick={() => onViewModeChange("day")}
                data-testid="button-day-view"
              >
                Day
              </Button>
              <Button 
                size="sm" 
                variant={viewMode === "week" ? "default" : "outline"}
                onClick={() => onViewModeChange("week")}
                data-testid="button-week-view"
              >
                Week
              </Button>
              <Button 
                size="sm" 
                variant={viewMode === "month" ? "default" : "outline"}
                onClick={() => onViewModeChange("month")}
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
            <div className="col-span-1 space-y-16">
              {timeSlots.map((hour) => (
                <div key={hour} className="text-sm text-muted-foreground text-right pr-2 h-16 flex items-start pt-2">
                  {formatTime(hour)}
                </div>
              ))}
            </div>

            {/* Schedule Column */}
            <div className="col-span-11 space-y-4">
              {timeSlots.map((timeSlot) => {
                const jobsInSlot = getJobsForTimeSlot(timeSlot);
                return (
                  <div key={timeSlot} className="min-h-16 border-l border-muted pl-4 relative">
                    {jobsInSlot.length === 0 ? (
                      <div className="h-16 flex items-center">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-muted-foreground hover:text-foreground"
                          data-testid={`button-add-job-${timeSlot}`}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add job
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {jobsInSlot.map((job) => (
                          <Card 
                            key={job.id} 
                            className={`p-3 cursor-pointer hover:shadow-md transition-shadow border-l-4 ${
                              job.status === 'scheduled' ? 'border-l-green-500' :
                              job.status === 'unassigned' ? 'border-l-orange-500' :
                              job.status === 'in_progress' ? 'border-l-blue-500' : 'border-l-gray-500'
                            }`}
                            data-testid={`schedule-job-${job.id}`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3">
                                <Badge className={getStatusColor(job.status)} data-testid={`job-status-${job.id}`}>
                                  {job.status.replace('_', ' ')}
                                </Badge>
                                <div>
                                  <h4 className="font-medium text-foreground" data-testid={`job-title-${job.id}`}>
                                    {job.jobNumber} — {job.title}
                                  </h4>
                                  <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                                    <div className="flex items-center space-x-1">
                                      <Clock className="w-3 h-3" />
                                      <span data-testid={`job-time-${job.id}`}>{job.time}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <User className="w-3 h-3" />
                                      <span data-testid={`job-customer-${job.id}`}>{job.customer}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-1 mt-1 text-sm text-muted-foreground">
                                    <MapPin className="w-3 h-3" />
                                    <span data-testid={`job-address-${job.id}`}>{job.address}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right flex items-center space-x-2">
                                <div>
                                  <p className="font-medium text-foreground" data-testid={`job-amount-${job.id}`}>
                                    {job.amount}
                                  </p>
                                  <Avatar className="w-6 h-6 mt-1">
                                    <AvatarImage src={job.technicianImage} alt={job.technician} />
                                    <AvatarFallback className="text-xs">
                                      {job.technician.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between">
        <Button variant="outline" data-testid="button-export-schedule">
          Export
        </Button>
        <div className="flex items-center space-x-3">
          <Button variant="outline" data-testid="button-block-time">
            Block Time
          </Button>
          <Button data-testid="button-apply-changes">
            Apply Changes
          </Button>
        </div>
      </div>
    </div>
  );
}