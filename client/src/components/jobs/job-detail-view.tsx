import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Calendar,
  FileText,
  Camera,
  MessageSquare,
  Edit,
  CheckCircle
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface JobDetailViewProps {
  jobId: string;
  onClose: () => void;
}

export function JobDetailView({ jobId, onClose }: JobDetailViewProps) {
  const [newNote, setNewNote] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: job, isLoading } = useQuery({
    queryKey: [`/api/jobs/${jobId}`],
  });

  const addNoteMutation = useMutation({
    mutationFn: async (note: string) => {
      await apiRequest("POST", `/api/jobs/${jobId}/notes`, { note });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/jobs/${jobId}`] });
      setNewNote("");
      toast({ title: "Note added successfully" });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      await apiRequest("PATCH", `/api/jobs/${jobId}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/jobs/${jobId}`] });
      toast({ title: "Job status updated" });
    },
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  const mockJobData = {
    id: jobId,
    jobNumber: "#1025",
    title: "Panel Upgrade",
    customer: {
      firstName: "Chris",
      lastName: "Wong",
      email: "chris@example.com",
      phone: "(555) 123-4567"
    },
    address: "214 Oak Street, Greenwood",
    status: "in_progress",
    scheduledDate: "Today, 4:00 PM - 6:00 PM",
    assignedTechnician: {
      firstName: "Maria",
      lastName: "Gomez",
      profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b25fcaaa?w=32&h=32&fit=crop&crop=face"
    },
    amount: "$960.00",
    notes: "Panel located in garage. Customer requests minimal downtime.",
    activity: [
      {
        type: "photo",
        message: "Photo uploaded: panel_before.jpg",
        timestamp: "10:45 AM",
        user: "Maria Gomez"
      },
      {
        type: "note",
        message: "Tech note added: Breaker #4 loose.",
        timestamp: "10:20 AM",
        user: "Maria Gomez"
      },
      {
        type: "booking",
        message: "AI Agent confirmed booking with customer",
        timestamp: "9:15 AM",
        user: "AI Agent"
      },
      {
        type: "assignment",
        message: "Tech assigned: Maria Gomez",
        timestamp: "9:40 AM",
        user: "System"
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onClose} data-testid="button-back">
            ← Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Job {mockJobData.jobNumber}</h1>
            <p className="text-muted-foreground">{mockJobData.title}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" data-testid="button-quote">
            Quote
          </Button>
          <Button 
            variant="default"
            onClick={() => updateStatusMutation.mutate("completed")}
            data-testid="button-mark-complete"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark Complete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Job Details</CardTitle>
                <Badge className={getStatusColor(mockJobData.status)}>
                  {mockJobData.status.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Customer</label>
                  <p className="font-medium">{mockJobData.customer.firstName} {mockJobData.customer.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Scheduled</label>
                  <p className="font-medium">{mockJobData.scheduledDate}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Address</label>
                <div className="flex items-center space-x-2 mt-1">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <p>{mockJobData.address}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Assigned</label>
                <div className="flex items-center space-x-2 mt-1">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={mockJobData.assignedTechnician.profileImageUrl} />
                    <AvatarFallback>
                      {mockJobData.assignedTechnician.firstName[0]}{mockJobData.assignedTechnician.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <p>{mockJobData.assignedTechnician.firstName} {mockJobData.assignedTechnician.lastName}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Amount</label>
                <p className="font-medium text-lg">{mockJobData.amount}</p>
              </div>
            </CardContent>
          </Card>

          {/* Route Information */}
          <Card>
            <CardHeader>
              <CardTitle>Route from Current Location</CardTitle>
              <p className="text-sm text-muted-foreground">Est. 22 min (8.4 mi)</p>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 p-4 rounded-lg mb-4">
                <div className="aspect-video bg-gray-200 rounded flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Map View</span>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-start space-x-2">
                  <span className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <span>Head north on Main St for 0.5 mi</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <span>Turn right onto 3rd Ave and continue 1.2 mi</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <span>Merge onto Hwy 45 S via the ramp to Greenwood</span>
                </div>
              </div>

              <div className="flex space-x-2 mt-4">
                <Button size="sm" data-testid="button-open-maps">
                  Open in Google Maps
                </Button>
                <Button size="sm" variant="outline" data-testid="button-copy-directions">
                  Copy Directions
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Photos */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Photos</CardTitle>
                <Button size="sm" data-testid="button-upload-photo">
                  <Camera className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">Upload job images</p>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">Drag & drop photos here</p>
                <Button size="sm" variant="outline" data-testid="button-browse-photos">
                  Browse Files
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mt-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                    <Camera className="w-6 h-6 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
              <p className="text-sm text-muted-foreground">Live log</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockJobData.activity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.timestamp} • {activity.user}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Client Signature */}
          <Card>
            <CardHeader>
              <CardTitle>Client Signature</CardTitle>
              <p className="text-sm text-muted-foreground">Required on completion</p>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                <Edit className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">Capture signature</p>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" data-testid="button-clear-signature">
                    Clear
                  </Button>
                  <Button size="sm" data-testid="button-capture-signature">
                    Capture Signature
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
              <p className="text-sm text-muted-foreground">Internal</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm">{mockJobData.notes}</p>
              </div>
              
              <div className="space-y-2">
                <Textarea
                  placeholder="Add a note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                  data-testid="textarea-new-note"
                />
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => addNoteMutation.mutate(newNote)}
                    disabled={!newNote.trim()}
                    data-testid="button-send-update"
                  >
                    Send Update
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    data-testid="button-call-customer"
                  >
                    Call Customer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}