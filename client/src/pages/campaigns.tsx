import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Plus, Filter, Megaphone, Play, Pause, Edit, Trash, Eye, Mail, MessageSquare, Phone } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Campaigns() {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["/api/campaigns"],
  });

  const deleteCampaignMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/campaigns/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      toast({ title: "Campaign deleted successfully" });
    },
    onError: () => {
      toast({ 
        title: "Error", 
        description: "Failed to delete campaign",
        variant: "destructive" 
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="w-4 h-4" />;
      case "sms":
        return <MessageSquare className="w-4 h-4" />;
      case "voice":
        return <Phone className="w-4 h-4" />;
      default:
        return <Megaphone className="w-4 h-4" />;
    }
  };

  const calculateEngagementRate = (campaign: any) => {
    const totalEngagement = (campaign.openCount || 0) + (campaign.clickCount || 0) + (campaign.responseCount || 0);
    const sentCount = campaign.sentCount || 0;
    return sentCount > 0 ? Math.round((totalEngagement / sentCount) * 100) : 0;
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Mock data for demonstration
  const mockCampaigns = [
    {
      id: "1",
      name: "Spring HVAC Maintenance",
      type: "email",
      status: "active",
      sentCount: 1250,
      openCount: 387,
      clickCount: 89,
      responseCount: 23,
      createdAt: new Date().toISOString(),
      scheduledDate: new Date().toISOString()
    },
    {
      id: "2",
      name: "Emergency Electrical Services",
      type: "sms",
      status: "completed",
      sentCount: 850,
      openCount: 680,
      clickCount: 145,
      responseCount: 67,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      scheduledDate: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: "3",
      name: "Customer Satisfaction Survey",
      type: "voice",
      status: "paused",
      sentCount: 320,
      openCount: 280,
      clickCount: 0,
      responseCount: 124,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      scheduledDate: new Date(Date.now() - 172800000).toISOString()
    }
  ];

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
                  Campaigns
                </h1>
                <p className="text-muted-foreground mt-1">
                  Create and manage marketing campaigns for lead generation and customer retention.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline"
                  data-testid="button-analytics"
                >
                  Analytics
                </Button>
                <Button 
                  onClick={() => setShowForm(true)}
                  data-testid="button-new-campaign"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Campaign
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Campaigns</p>
                      <p className="text-2xl font-bold text-foreground">3</p>
                      <p className="text-xs text-green-600 mt-1">2 scheduled this week</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Megaphone className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Sent</p>
                      <p className="text-2xl font-bold text-foreground">2,420</p>
                      <p className="text-xs text-blue-600 mt-1">This month</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Response Rate</p>
                      <p className="text-2xl font-bold text-foreground">8.8%</p>
                      <p className="text-xs text-purple-600 mt-1">+2.3% vs last month</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <MessageSquare className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Leads Generated</p>
                      <p className="text-2xl font-bold text-foreground">214</p>
                      <p className="text-xs text-orange-600 mt-1">67 this week</p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Phone className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <Select>
                      <SelectTrigger data-testid="select-status-filter">
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Type</label>
                    <Select>
                      <SelectTrigger data-testid="select-type-filter">
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All types</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="voice">Voice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Campaign Name</label>
                    <Input 
                      placeholder="Search campaigns..."
                      data-testid="input-campaign-filter"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button variant="outline" className="w-full" data-testid="button-apply-filters">
                      <Filter className="w-4 h-4 mr-2" />
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Campaigns Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sent</TableHead>
                      <TableHead>Engagement</TableHead>
                      <TableHead>Response Rate</TableHead>
                      <TableHead>Scheduled</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockCampaigns?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="flex flex-col items-center space-y-2">
                            <Megaphone className="w-8 h-8 text-muted-foreground" />
                            <p className="text-muted-foreground">No campaigns found</p>
                            <Button 
                              onClick={() => setShowForm(true)}
                              size="sm"
                              data-testid="button-create-first-campaign"
                            >
                              Create your first campaign
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      mockCampaigns?.map((campaign: any) => {
                        const engagementRate = calculateEngagementRate(campaign);
                        const responseRate = campaign.sentCount > 0 ? Math.round((campaign.responseCount / campaign.sentCount) * 100) : 0;
                        
                        return (
                          <TableRow key={campaign.id} data-testid={`campaign-row-${campaign.id}`}>
                            <TableCell>
                              <div>
                                <p className="font-medium text-foreground" data-testid={`campaign-name-${campaign.id}`}>
                                  {campaign.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Created {new Date(campaign.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {getTypeIcon(campaign.type)}
                                <span className="text-sm capitalize" data-testid={`campaign-type-${campaign.id}`}>
                                  {campaign.type}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                className={getStatusColor(campaign.status)}
                                data-testid={`campaign-status-${campaign.id}`}
                              >
                                {campaign.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium" data-testid={`campaign-sent-${campaign.id}`}>
                                {campaign.sentCount.toLocaleString()}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">{engagementRate}%</span>
                                </div>
                                <Progress value={engagementRate} className="h-1" />
                                <div className="text-xs text-muted-foreground">
                                  {campaign.openCount} opens, {campaign.clickCount} clicks
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium" data-testid={`campaign-response-rate-${campaign.id}`}>
                                {responseRate}%
                              </span>
                              <p className="text-xs text-muted-foreground">
                                {campaign.responseCount} responses
                              </p>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm" data-testid={`campaign-scheduled-${campaign.id}`}>
                                {new Date(campaign.scheduledDate).toLocaleDateString()}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  data-testid={`button-view-campaign-${campaign.id}`}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                {campaign.status === "active" ? (
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    data-testid={`button-pause-campaign-${campaign.id}`}
                                  >
                                    <Pause className="w-4 h-4" />
                                  </Button>
                                ) : campaign.status === "paused" ? (
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    data-testid={`button-resume-campaign-${campaign.id}`}
                                  >
                                    <Play className="w-4 h-4" />
                                  </Button>
                                ) : null}
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  data-testid={`button-edit-campaign-${campaign.id}`}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => deleteCampaignMutation.mutate(campaign.id)}
                                  data-testid={`button-delete-campaign-${campaign.id}`}
                                >
                                  <Trash className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
