import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Building2, 
  Users, 
  Bot, 
  Phone, 
  Mail, 
  Calendar, 
  FileText, 
  Shield, 
  CreditCard,
  Settings,
  Plus,
  Edit,
  Trash,
  Check,
  X
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("organization");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: aiSettings } = useQuery({
    queryKey: ["/api/ai/settings"],
  });

  const updateAiSettingsMutation = useMutation({
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
        description: "Failed to update AI settings",
        variant: "destructive" 
      });
    },
  });

  const handleSaveChanges = () => {
    toast({ title: "Settings saved successfully" });
  };

  const handlePublish = () => {
    toast({ title: "Settings published successfully" });
  };

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
                  Settings
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage your business settings and configuration.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline"
                  onClick={handleSaveChanges}
                  data-testid="button-save-changes"
                >
                  Save Changes
                </Button>
                <Button 
                  onClick={handlePublish}
                  data-testid="button-publish"
                >
                  Publish
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Settings Navigation */}
              <div className="space-y-2">
                <Card>
                  <CardContent className="p-4">
                    <nav className="space-y-1">
                      {[
                        { id: "organization", label: "Organization", icon: Building2 },
                        { id: "team", label: "Team & Roles", icon: Users },
                        { id: "ai-agent", label: "AI Agent", icon: Bot },
                        { id: "telephony", label: "Telephony", icon: Phone },
                        { id: "email", label: "Email", icon: Mail },
                        { id: "scheduling", label: "Scheduling", icon: Calendar },
                        { id: "quotes-invoices", label: "Quotes & Invoices", icon: FileText },
                        { id: "security", label: "Security", icon: Shield },
                        { id: "integrations", label: "Integrations", icon: Settings },
                        { id: "payments", label: "Payments", icon: CreditCard },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className={`w-full flex items-center space-x-3 px-3 py-2 text-left text-sm font-medium rounded-lg transition-colors ${
                            activeTab === item.id
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                          data-testid={`nav-${item.id}`}
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </nav>
                  </CardContent>
                </Card>
              </div>

              {/* Settings Content */}
              <div className="lg:col-span-3">
                {activeTab === "organization" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Organization Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="legal-name">Legal Name</Label>
                          <Input 
                            id="legal-name" 
                            defaultValue="AC Pros LLC" 
                            data-testid="input-legal-name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="address">Address</Label>
                          <Input 
                            id="address" 
                            defaultValue="123 Main St, Austin, TX" 
                            data-testid="input-address"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input 
                            id="phone" 
                            defaultValue="(512) 555-0142" 
                            data-testid="input-phone"
                          />
                        </div>
                        <div>
                          <Label htmlFor="website">Website</Label>
                          <Input 
                            id="website" 
                            defaultValue="acpros.example" 
                            data-testid="input-website"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeTab === "team" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Team & Roles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-foreground">
                            Invite teammates and set permissions
                          </p>
                          <Button size="sm" data-testid="button-invite-member">
                            <Plus className="w-4 h-4 mr-2" />
                            Invite
                          </Button>
                        </div>
                        
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Role</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow data-testid="team-member-alex">
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src={user?.profileImageUrl} />
                                    <AvatarFallback>AC</AvatarFallback>
                                  </Avatar>
                                  <span>Alex Carter</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge>Admin</Badge>
                              </TableCell>
                              <TableCell>
                                <Button size="sm" variant="ghost" data-testid="button-manage-alex">
                                  Manage
                                </Button>
                              </TableCell>
                            </TableRow>
                            <TableRow data-testid="team-member-jamie">
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <Avatar className="w-8 h-8">
                                    <AvatarFallback>JN</AvatarFallback>
                                  </Avatar>
                                  <span>Jamie Nguyen</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">Dispatcher</Badge>
                              </TableCell>
                              <TableCell>
                                <Button size="sm" variant="ghost" data-testid="button-manage-jamie">
                                  Manage
                                </Button>
                              </TableCell>
                            </TableRow>
                            <TableRow data-testid="team-member-marcus">
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <Avatar className="w-8 h-8">
                                    <AvatarFallback>ML</AvatarFallback>
                                  </Avatar>
                                  <span>Marcus Lee</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">Technician</Badge>
                              </TableCell>
                              <TableCell>
                                <Button size="sm" variant="ghost" data-testid="button-manage-marcus">
                                  Manage
                                </Button>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeTab === "ai-agent" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>AI Agent</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <div>
                            <p className="font-medium text-green-800">AI Agent Online</p>
                            <p className="text-sm text-green-700">
                              Configure voice agent settings
                            </p>
                          </div>
                        </div>
                        <Switch defaultChecked data-testid="switch-ai-agent" />
                      </div>

                      <div>
                        <Label htmlFor="ai-greeting">Greeting</Label>
                        <Textarea
                          id="ai-greeting"
                          placeholder="AI agent greeting message..."
                          defaultValue="Thanks for calling AC Pros..."
                          rows={3}
                          data-testid="textarea-ai-greeting"
                        />
                      </div>

                      <div>
                        <Label>Business Hours</Label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div>
                            <Label htmlFor="hours-start">Hours</Label>
                            <Input 
                              id="hours-start" 
                              defaultValue="Mon-Fri, 8a-6p" 
                              data-testid="input-business-hours"
                            />
                          </div>
                          <div>
                            <Label htmlFor="travel-buffer">Travel Buffer</Label>
                            <Input 
                              id="travel-buffer" 
                              defaultValue="15 min" 
                              data-testid="input-travel-buffer"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch id="enable-after-hours" data-testid="switch-after-hours" />
                        <Label htmlFor="enable-after-hours">
                          Enable after hours voicemail and SMS
                        </Label>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeTab === "telephony" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Telephony</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <Label>Numbers and routing</Label>
                        <div className="mt-2 space-y-3">
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">Primary Number: (512) 555-0142</p>
                              <p className="text-sm text-muted-foreground">
                                Routing: AI first, escalate to team
                              </p>
                            </div>
                            <Button size="sm" variant="outline" data-testid="button-configure-routing">
                              Configure
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeTab === "email" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Email</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <Label>Connect Gmail/Outlook</Label>
                        <div className="mt-2 space-y-3">
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">Gmail: connected as spis@acpros.com</p>
                              <p className="text-sm text-muted-foreground">
                                Outlook: not connected
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" data-testid="button-manage-integrations">
                                Manage Integrations
                              </Button>
                              <Button size="sm" data-testid="button-add-mailbox">
                                Add Mailbox
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeTab === "scheduling" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Scheduling</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="default-duration">Default Duration</Label>
                          <Input 
                            id="default-duration" 
                            defaultValue="60 min" 
                            data-testid="input-default-duration"
                          />
                        </div>
                        <div>
                          <Label htmlFor="travel-buffer-schedule">Travel Buffer</Label>
                          <Input 
                            id="travel-buffer-schedule" 
                            defaultValue="15 min" 
                            data-testid="input-travel-buffer-schedule"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeTab === "quotes-invoices" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Quotes & Invoices</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="brand-color">Brand Color</Label>
                          <Select defaultValue="primary">
                            <SelectTrigger data-testid="select-brand-color">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="primary">Primary</SelectItem>
                              <SelectItem value="blue">Blue</SelectItem>
                              <SelectItem value="green">Green</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="invoice-prefix">Invoice Prefix</Label>
                          <Input 
                            id="invoice-prefix" 
                            defaultValue="INV-" 
                            data-testid="input-invoice-prefix"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeTab === "security" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Security</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <Label>Authentication & access</Label>
                        <div className="mt-2 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Two-factor: Enabled</p>
                              <p className="text-sm text-muted-foreground">
                                Password Policy: Strong
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeTab === "integrations" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Integrations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>App</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow data-testid="integration-gmail">
                              <TableCell>Gmail</TableCell>
                              <TableCell>
                                <Badge className="bg-green-100 text-green-800">Connected</Badge>
                              </TableCell>
                              <TableCell>
                                <Button size="sm" variant="ghost" data-testid="button-manage-gmail">
                                  Manage
                                </Button>
                              </TableCell>
                            </TableRow>
                            <TableRow data-testid="integration-outlook">
                              <TableCell>Outlook</TableCell>
                              <TableCell>
                                <Badge variant="outline">Not connected</Badge>
                              </TableCell>
                              <TableCell>
                                <Button size="sm" data-testid="button-connect-outlook">
                                  Connect
                                </Button>
                              </TableCell>
                            </TableRow>
                            <TableRow data-testid="integration-stripe">
                              <TableCell>Stripe</TableCell>
                              <TableCell>
                                <Badge className="bg-green-100 text-green-800">Connected</Badge>
                              </TableCell>
                              <TableCell>
                                <Button size="sm" variant="ghost" data-testid="button-manage-stripe">
                                  Manage
                                </Button>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeTab === "payments" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Payments</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <Label>Billing and receipts</Label>
                        <div className="mt-2 space-y-3">
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">Payout Account: **** 6721</p>
                              <p className="text-sm text-muted-foreground">
                                Default Tax Rate: 8.25%
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
