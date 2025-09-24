import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, PhoneIncoming, PhoneOutgoing, Clock, User, Bot, Filter, Play, MessageSquare } from "lucide-react";

export default function CallLogs() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: callLogs, isLoading } = useQuery({
    queryKey: ["/api/call-logs"],
  });

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case "job_booked":
        return "bg-green-100 text-green-800";
      case "quote_requested":
        return "bg-blue-100 text-blue-800";
      case "callback_requested":
        return "bg-orange-100 text-orange-800";
      case "no_interest":
        return "bg-red-100 text-red-800";
      case "voicemail":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
                  Call Logs
                </h1>
                <p className="text-muted-foreground mt-1">
                  Track and analyze customer calls and AI agent interactions.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline"
                  data-testid="button-export"
                >
                  Export
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Calls Today</p>
                      <p className="text-2xl font-bold text-foreground">47</p>
                      <p className="text-xs text-green-600 mt-1">+23% from yesterday</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Phone className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Jobs Booked</p>
                      <p className="text-2xl font-bold text-foreground">18</p>
                      <p className="text-xs text-green-600 mt-1">38% conversion rate</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <User className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">AI Handled</p>
                      <p className="text-2xl font-bold text-foreground">42</p>
                      <p className="text-xs text-purple-600 mt-1">89% of all calls</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Bot className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg Duration</p>
                      <p className="text-2xl font-bold text-foreground">3:24</p>
                      <p className="text-xs text-blue-600 mt-1">-12s from last week</p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Clock className="w-6 h-6 text-orange-600" />
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
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Direction</label>
                    <Select>
                      <SelectTrigger data-testid="select-direction-filter">
                        <SelectValue placeholder="All calls" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All calls</SelectItem>
                        <SelectItem value="inbound">Inbound</SelectItem>
                        <SelectItem value="outbound">Outbound</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Outcome</label>
                    <Select>
                      <SelectTrigger data-testid="select-outcome-filter">
                        <SelectValue placeholder="All outcomes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All outcomes</SelectItem>
                        <SelectItem value="job_booked">Job Booked</SelectItem>
                        <SelectItem value="quote_requested">Quote Requested</SelectItem>
                        <SelectItem value="no_interest">No Interest</SelectItem>
                        <SelectItem value="callback_requested">Callback Requested</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Handler</label>
                    <Select>
                      <SelectTrigger data-testid="select-handler-filter">
                        <SelectValue placeholder="All handlers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All handlers</SelectItem>
                        <SelectItem value="ai">AI Agent</SelectItem>
                        <SelectItem value="human">Human</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                    <Input 
                      placeholder="Search phone numbers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      data-testid="input-phone-filter"
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

            {/* Call Logs Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Call</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Outcome</TableHead>
                      <TableHead>Handler</TableHead>
                      <TableHead>Follow Up</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {callLogs?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="flex flex-col items-center space-y-2">
                            <Phone className="w-8 h-8 text-muted-foreground" />
                            <p className="text-muted-foreground">No call logs found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      // Mock data for demonstration
                      [
                        {
                          id: "1",
                          phoneNumber: "(555) 123-4567",
                          direction: "inbound",
                          duration: 204,
                          outcome: "job_booked",
                          aiGenerated: true,
                          followUpRequired: false,
                          customer: { firstName: "Sarah", lastName: "Johnson" },
                          createdAt: new Date().toISOString(),
                          transcript: "Customer called about HVAC maintenance..."
                        },
                        {
                          id: "2",
                          phoneNumber: "(555) 987-6543",
                          direction: "inbound",
                          duration: 156,
                          outcome: "quote_requested",
                          aiGenerated: true,
                          followUpRequired: true,
                          customer: { firstName: "Mike", lastName: "Davis" },
                          createdAt: new Date(Date.now() - 3600000).toISOString(),
                          transcript: "Customer inquired about electrical work..."
                        },
                        {
                          id: "3",
                          phoneNumber: "(555) 555-0123",
                          direction: "outbound",
                          duration: 89,
                          outcome: "no_answer",
                          aiGenerated: false,
                          followUpRequired: false,
                          customer: null,
                          createdAt: new Date(Date.now() - 7200000).toISOString(),
                          transcript: null
                        }
                      ].map((call: any) => (
                        <TableRow key={call.id} data-testid={`call-row-${call.id}`}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {call.direction === "inbound" ? (
                                <PhoneIncoming className="w-4 h-4 text-green-600" />
                              ) : (
                                <PhoneOutgoing className="w-4 h-4 text-blue-600" />
                              )}
                              <span className="font-medium" data-testid={`call-phone-${call.id}`}>
                                {call.phoneNumber}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {call.customer ? (
                              <div className="flex items-center space-x-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${call.customer.firstName}+${call.customer.lastName}`} />
                                  <AvatarFallback className="text-xs">
                                    {call.customer.firstName[0]}{call.customer.lastName[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm" data-testid={`call-customer-${call.id}`}>
                                  {call.customer.firstName} {call.customer.lastName}
                                </span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">Unknown</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3 text-muted-foreground" />
                              <span className="text-sm" data-testid={`call-duration-${call.id}`}>
                                {call.duration ? formatDuration(call.duration) : '-'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={getOutcomeColor(call.outcome)}
                              data-testid={`call-outcome-${call.id}`}
                            >
                              {call.outcome.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              {call.aiGenerated ? (
                                <>
                                  <Bot className="w-3 h-3 text-purple-600" />
                                  <span className="text-sm text-purple-600">AI Agent</span>
                                </>
                              ) : (
                                <>
                                  <User className="w-3 h-3 text-blue-600" />
                                  <span className="text-sm text-blue-600">Human</span>
                                </>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {call.followUpRequired ? (
                              <Badge variant="outline" className="bg-orange-50 text-orange-700">
                                Required
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">None</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground" data-testid={`call-date-${call.id}`}>
                              {new Date(call.createdAt).toLocaleDateString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {call.transcript && (
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  data-testid={`button-view-transcript-${call.id}`}
                                >
                                  <MessageSquare className="w-4 h-4" />
                                </Button>
                              )}
                              {call.duration && (
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  data-testid={`button-play-call-${call.id}`}
                                >
                                  <Play className="w-4 h-4" />
                                </Button>
                              )}
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
