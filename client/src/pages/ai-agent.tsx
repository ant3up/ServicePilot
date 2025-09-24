import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Phone, Settings, Play, Pause, Activity, MessageSquare, Clock, User } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AiAgent() {
  const [isActive, setIsActive] = useState(true);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ["/api/ai/settings"],
  });

  const { data: callLogs } = useQuery({
    queryKey: ["/api/call-logs"],
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/ai/settings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai/settings"] });
      toast({ title: "AI Agent settings updated successfully" });
    },
    onError: () => {
      toast({ 
        title: "Error", 
        description: "Failed to update settings",
        variant: "destructive" 
      });
    },
  });

  const handleSaveSettings = () => {
    updateSettingsMutation.mutate({
      greeting: "Hello! Thank you for calling Call Mate. How can I help you today?",
      businessHours: { start: "09:00", end: "17:00", days: ["mon", "tue", "wed", "thu", "fri"] },
      services: ["HVAC", "Electrical", "Plumbing"],
      isActive: isActive
    });
  };

  if (settingsLoading) {
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
                  AI Agent
                </h1>
                <p className="text-muted-foreground mt-1">
                  Configure your AI voice agent for automated customer service.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                  <span className={`text-sm font-medium ${isActive ? 'text-green-700' : 'text-gray-600'}`}>
                    {isActive ? 'Online' : 'Offline'}
                  </span>
                </div>
                <Button 
                  variant={isActive ? "destructive" : "default"}
                  onClick={() => setIsActive(!isActive)}
                  data-testid="button-toggle-agent"
                >
                  {isActive ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause Agent
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start Agent
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Calls Today</p>
                      <p className="text-2xl font-bold text-foreground">47</p>
                      <p className="text-xs text-green-600 mt-1">+18% vs yesterday</p>
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
                      <p className="text-xs text-green-600 mt-1">38% success rate</p>
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
                      <p className="text-sm font-medium text-muted-foreground">Avg Duration</p>
                      <p className="text-2xl font-bold text-foreground">3:24</p>
                      <p className="text-xs text-blue-600 mt-1">Efficient handling</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Clock className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Satisfaction</p>
                      <p className="text-2xl font-bold text-foreground">4.8</p>
                      <p className="text-xs text-green-600 mt-1">Based on feedback</p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Activity className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Configuration */}
              <div className="lg:col-span-2">
                <Tabs defaultValue="greeting" className="space-y-6">
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="greeting" data-testid="tab-greeting">Greeting</TabsTrigger>
                    <TabsTrigger value="hours" data-testid="tab-hours">Hours</TabsTrigger>
                    <TabsTrigger value="services" data-testid="tab-services">Services</TabsTrigger>
                    <TabsTrigger value="rules" data-testid="tab-rules">Rules</TabsTrigger>
                  </TabsList>

                  <TabsContent value="greeting">
                    <Card>
                      <CardHeader>
                        <CardTitle>AI Greeting Configuration</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="greeting">Greeting Message</Label>
                          <Textarea
                            id="greeting"
                            placeholder="Enter the greeting message for your AI agent..."
                            defaultValue="Hello! Thank you for calling Call Mate. How can I help you today?"
                            rows={4}
                            data-testid="textarea-greeting"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            This message will be spoken when customers call your business.
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch id="personalized" data-testid="switch-personalized" />
                          <Label htmlFor="personalized">Use personalized greetings for returning customers</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch id="hold-music" data-testid="switch-hold-music" />
                          <Label htmlFor="hold-music">Play hold music during transfers</Label>
                        </div>
                        
                        <Button onClick={handleSaveSettings} data-testid="button-save-greeting">
                          Save Greeting
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="hours">
                    <Card>
                      <CardHeader>
                        <CardTitle>Business Hours</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="open-time">Opening Time</Label>
                            <Input id="open-time" type="time" defaultValue="09:00" data-testid="input-open-time" />
                          </div>
                          <div>
                            <Label htmlFor="close-time">Closing Time</Label>
                            <Input id="close-time" type="time" defaultValue="17:00" data-testid="input-close-time" />
                          </div>
                        </div>
                        
                        <div>
                          <Label>Operating Days</Label>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                              <div key={day} className="flex items-center space-x-2">
                                <Switch id={day.toLowerCase()} defaultChecked={!['Saturday', 'Sunday'].includes(day)} data-testid={`switch-${day.toLowerCase()}`} />
                                <Label htmlFor={day.toLowerCase()}>{day}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="after-hours-message">After Hours Message</Label>
                          <Textarea
                            id="after-hours-message"
                            placeholder="Message for calls outside business hours..."
                            defaultValue="Thank you for calling. Our office is currently closed. Please leave a message and we'll get back to you during business hours."
                            rows={3}
                            data-testid="textarea-after-hours"
                          />
                        </div>
                        
                        <Button onClick={handleSaveSettings} data-testid="button-save-hours">
                          Save Hours
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="services">
                    <Card>
                      <CardHeader>
                        <CardTitle>Available Services</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          {['HVAC Repair & Maintenance', 'Electrical Work', 'Plumbing Services', 'Emergency Repairs'].map((service, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <p className="font-medium">{service}</p>
                                <p className="text-sm text-muted-foreground">Available for booking</p>
                              </div>
                              <Switch defaultChecked data-testid={`switch-service-${index}`} />
                            </div>
                          ))}
                        </div>
                        
                        <div>
                          <Label htmlFor="pricing-info">Pricing Information</Label>
                          <Textarea
                            id="pricing-info"
                            placeholder="Information about pricing to share with customers..."
                            defaultValue="Our service call fee is $85, which is waived with any repair over $150. We provide free estimates for all major repairs."
                            rows={3}
                            data-testid="textarea-pricing"
                          />
                        </div>
                        
                        <Button onClick={handleSaveSettings} data-testid="button-save-services">
                          Save Services
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="rules">
                    <Card>
                      <CardHeader>
                        <CardTitle>Escalation Rules</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Switch id="complex-issues" defaultChecked data-testid="switch-complex-issues" />
                            <Label htmlFor="complex-issues">Transfer complex technical issues to human</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Switch id="angry-customers" defaultChecked data-testid="switch-angry-customers" />
                            <Label htmlFor="angry-customers">Escalate upset or angry customers</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Switch id="emergency-calls" defaultChecked data-testid="switch-emergency-calls" />
                            <Label htmlFor="emergency-calls">Prioritize emergency service requests</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Switch id="billing-issues" data-testid="switch-billing-issues" />
                            <Label htmlFor="billing-issues">Handle basic billing inquiries</Label>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="max-call-duration">Maximum Call Duration (minutes)</Label>
                          <Input id="max-call-duration" type="number" defaultValue="15" min="5" max="30" data-testid="input-max-duration" />
                          <p className="text-xs text-muted-foreground mt-1">
                            Calls longer than this will be transferred to a human representative.
                          </p>
                        </div>
                        
                        <Button onClick={handleSaveSettings} data-testid="button-save-rules">
                          Save Rules
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Live Activity */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="w-5 h-5" />
                      <span>Live Activity</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium">Currently handling call</span>
                        </div>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          2:34
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        <p>Customer: (555) 123-4567</p>
                        <p>Topic: HVAC Maintenance</p>
                        <p>Status: Scheduling appointment</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Calls</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { time: "2:34 PM", outcome: "job_booked", duration: "4:12" },
                        { time: "1:56 PM", outcome: "quote_requested", duration: "2:45" },
                        { time: "12:30 PM", outcome: "no_interest", duration: "1:23" },
                        { time: "11:45 AM", outcome: "callback_requested", duration: "3:01" }
                      ].map((call, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{call.time}</span>
                          <Badge 
                            variant="outline" 
                            className={
                              call.outcome === 'job_booked' ? 'bg-green-50 text-green-700' :
                              call.outcome === 'quote_requested' ? 'bg-blue-50 text-blue-700' :
                              call.outcome === 'callback_requested' ? 'bg-orange-50 text-orange-700' :
                              'bg-gray-50 text-gray-700'
                            }
                          >
                            {call.outcome.replace('_', ' ')}
                          </Badge>
                          <span className="text-muted-foreground">{call.duration}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Response Time</span>
                        <span className="font-medium">&lt; 2 seconds</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Accuracy</span>
                        <span className="font-medium">96.8%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Customer Satisfaction</span>
                        <span className="font-medium">4.8/5.0</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Uptime</span>
                        <span className="font-medium text-green-600">99.9%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
