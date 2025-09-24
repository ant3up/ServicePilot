import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MetricsCard } from "@/components/dashboard/metrics-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { ScheduleList } from "@/components/dashboard/schedule-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DollarSign, 
  Briefcase, 
  FileText, 
  Phone, 
  Plus, 
  Users, 
  Calendar, 
  Bot, 
  AlertTriangle 
} from "lucide-react";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
    retry: false,
  });

  if (isLoading || !isAuthenticated) {
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
        <main className="flex-1 overflow-auto bg-muted/30 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">
                  Dashboard
                </h1>
                <p className="text-muted-foreground mt-1">
                  Welcome back. Here's what's happening with your business today.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Select defaultValue="today">
                  <SelectTrigger className="w-40" data-testid="select-date-range">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricsCard
                title="Total Revenue"
                value={`$${metrics?.totalRevenue?.toLocaleString() || "0"}`}
                change="+12.5% from last week"
                icon={DollarSign}
                color="green"
                isLoading={metricsLoading}
              />
              <MetricsCard
                title="Active Jobs"
                value={metrics?.activeJobs?.toString() || "0"}
                change="8 scheduled today"
                icon={Briefcase}
                color="blue"
                isLoading={metricsLoading}
              />
              <MetricsCard
                title="Pending Quotes"
                value={metrics?.pendingQuotes?.toString() || "0"}
                change={`$${metrics?.pendingQuotesValue?.toLocaleString() || "0"} potential value`}
                icon={FileText}
                color="orange"
                isLoading={metricsLoading}
              />
              <MetricsCard
                title="AI Calls Today"
                value={metrics?.todaysCalls?.toString() || "0"}
                change="18 jobs booked"
                icon={Phone}
                color="purple"
                isLoading={metricsLoading}
              />
            </div>

            {/* Charts and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RevenueChart />
              <ActivityFeed activities={metrics?.recentActivity || []} />
            </div>

            {/* Today's Schedule & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ScheduleList jobs={(metrics?.recentActivity || []).filter((item: any) => item.type === 'job').slice(0, 5)} />
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle data-testid="text-quick-actions-title">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => window.location.href = "/jobs"}
                    data-testid="button-create-job"
                  >
                    <Plus className="w-5 h-5 mr-3 text-primary" />
                    Create New Job
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => window.location.href = "/quotes"}
                    data-testid="button-send-quote"
                  >
                    <FileText className="w-5 h-5 mr-3 text-primary" />
                    Send Quote
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => window.location.href = "/customers"}
                    data-testid="button-add-customer"
                  >
                    <Users className="w-5 h-5 mr-3 text-primary" />
                    Add Customer
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => window.location.href = "/scheduling"}
                    data-testid="button-view-schedule"
                  >
                    <Calendar className="w-5 h-5 mr-3 text-primary" />
                    View Schedule
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => window.location.href = "/ai-agent"}
                    data-testid="button-ai-settings"
                  >
                    <Bot className="w-5 h-5 mr-3 text-primary" />
                    AI Agent Settings
                  </Button>

                  {/* AI Agent Status */}
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-green-800" data-testid="text-ai-status">
                        AI Agent Online
                      </span>
                    </div>
                    <p className="text-xs text-green-700">Currently handling 2 calls</p>
                    <p className="text-xs text-green-700">
                      {metrics?.todaysCalls || 0} calls today • 18 jobs booked
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pending Tasks */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle data-testid="text-pending-tasks-title">Pending Tasks</CardTitle>
                  <span className="text-sm text-muted-foreground">5 items need attention</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Quote QU-2093 expires in 2 days
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Chris Wong - Panel Upgrade ($3,450)
                      </p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.location.href = "/quotes"}
                    data-testid="button-follow-up"
                  >
                    Follow Up
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Invoice INV-1029 overdue
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Marcus Lee - 15 days overdue ($850)
                      </p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.location.href = "/invoices"}
                    data-testid="button-send-reminder"
                  >
                    Send Reminder
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Review team schedule for next week
                      </p>
                      <p className="text-xs text-muted-foreground">
                        3 technicians, 15 jobs scheduled
                      </p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.location.href = "/scheduling"}
                    data-testid="button-review"
                  >
                    Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}