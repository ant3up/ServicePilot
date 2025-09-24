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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Filter, Briefcase, Edit, Trash, Eye, Calendar, User } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Jobs() {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["/api/jobs"],
  });

  const { data: customers } = useQuery({
    queryKey: ["/api/customers"],
  });

  const deleteJobMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/jobs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      toast({ title: "Job deleted successfully" });
    },
    onError: () => {
      toast({ 
        title: "Error", 
        description: "Failed to delete job",
        variant: "destructive" 
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

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
                  Jobs
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage and track all service jobs and assignments.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline"
                  data-testid="button-export"
                >
                  Export
                </Button>
                <Button 
                  onClick={() => setShowForm(true)}
                  data-testid="button-new-job"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Job
                </Button>
              </div>
            </div>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <Select>
                      <SelectTrigger data-testid="select-status-filter">
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date Range</label>
                    <Select>
                      <SelectTrigger data-testid="select-date-filter">
                        <SelectValue placeholder="Last 30 days" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7days">Last 7 days</SelectItem>
                        <SelectItem value="30days">Last 30 days</SelectItem>
                        <SelectItem value="90days">Last 90 days</SelectItem>
                        <SelectItem value="1year">Last year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Technician</label>
                    <Select>
                      <SelectTrigger data-testid="select-technician-filter">
                        <SelectValue placeholder="All technicians" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All technicians</SelectItem>
                        <SelectItem value="chris">Chris Wong</SelectItem>
                        <SelectItem value="jamie">Jamie Lee</SelectItem>
                        <SelectItem value="priya">Priya Patel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Customer</label>
                    <Input 
                      placeholder="Search customers..."
                      data-testid="input-customer-filter"
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

            {/* Jobs Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Technician</TableHead>
                      <TableHead>Scheduled Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(jobs as any[] || []).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="flex flex-col items-center space-y-2">
                            <Briefcase className="w-8 h-8 text-muted-foreground" />
                            <p className="text-muted-foreground">No jobs found</p>
                            <Button 
                              onClick={() => setShowForm(true)}
                              size="sm"
                              data-testid="button-create-first-job"
                            >
                              Create your first job
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      (jobs as any[] || []).map((job: any) => (
                        <TableRow key={job.id} data-testid={`job-row-${job.id}`}>
                          <TableCell className="font-medium" data-testid={`job-number-${job.id}`}>
                            {job.jobNumber}
                          </TableCell>
                          <TableCell data-testid={`job-customer-${job.id}`}>
                            {job.customer?.firstName} {job.customer?.lastName}
                          </TableCell>
                          <TableCell data-testid={`job-title-${job.id}`}>
                            {job.title}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={getStatusColor(job.status)}
                              data-testid={`job-status-${job.id}`}
                            >
                              {job.status?.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell data-testid={`job-technician-${job.id}`}>
                            {job.assignedTechnician ? (
                              <div className="flex items-center space-x-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarImage src={job.assignedTechnician.profileImageUrl} />
                                  <AvatarFallback className="text-xs">
                                    {job.assignedTechnician.firstName?.[0]}{job.assignedTechnician.lastName?.[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm">
                                  {job.assignedTechnician.firstName} {job.assignedTechnician.lastName}
                                </span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">Unassigned</span>
                            )}
                          </TableCell>
                          <TableCell data-testid={`job-scheduled-${job.id}`}>
                            {job.scheduledDate ? new Date(job.scheduledDate).toLocaleDateString() : '-'}
                          </TableCell>
                          <TableCell data-testid={`job-amount-${job.id}`}>
                            {job.totalAmount ? `$${parseFloat(job.totalAmount).toLocaleString()}` : '-'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                data-testid={`button-view-job-${job.id}`}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                data-testid={`button-schedule-job-${job.id}`}
                              >
                                <Calendar className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                data-testid={`button-assign-job-${job.id}`}
                              >
                                <User className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                data-testid={`button-edit-job-${job.id}`}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => deleteJobMutation.mutate(job.id)}
                                data-testid={`button-delete-job-${job.id}`}
                              >
                                <Trash className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
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
