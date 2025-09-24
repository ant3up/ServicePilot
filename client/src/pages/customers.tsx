import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Search, Users, Edit, Trash, Eye, Phone, Mail, MapPin } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Customers() {
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: customers, isLoading } = useQuery({
    queryKey: ["/api/customers"],
  });

  const deleteCustomerMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/customers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast({ title: "Customer deleted successfully" });
    },
    onError: () => {
      toast({ 
        title: "Error", 
        description: "Failed to delete customer",
        variant: "destructive" 
      });
    },
  });

  const filteredCustomers = customers?.filter((customer: any) =>
    `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone?.includes(searchQuery)
  );

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
                  Customers
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage your customer database and service history.
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
                  data-testid="button-new-customer"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Customer
                </Button>
              </div>
            </div>

            {/* Search */}
            <Card>
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search customers by name, email, or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    data-testid="input-search-customers"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Customers Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Jobs</TableHead>
                      <TableHead>Last Service</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex flex-col items-center space-y-2">
                            <Users className="w-8 h-8 text-muted-foreground" />
                            <p className="text-muted-foreground">
                              {searchQuery ? "No customers match your search" : "No customers found"}
                            </p>
                            <Button 
                              onClick={() => setShowForm(true)}
                              size="sm"
                              data-testid="button-add-first-customer"
                            >
                              Add your first customer
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCustomers?.map((customer: any) => (
                        <TableRow key={customer.id} data-testid={`customer-row-${customer.id}`}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${customer.firstName}+${customer.lastName}`} />
                                <AvatarFallback>
                                  {customer.firstName?.[0]}{customer.lastName?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-foreground" data-testid={`customer-name-${customer.id}`}>
                                  {customer.firstName} {customer.lastName}
                                </p>
                                {customer.notes && (
                                  <p className="text-xs text-muted-foreground">
                                    {customer.notes.length > 30 ? `${customer.notes.substring(0, 30)}...` : customer.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {customer.email && (
                                <div className="flex items-center space-x-1 text-sm">
                                  <Mail className="w-3 h-3 text-muted-foreground" />
                                  <span data-testid={`customer-email-${customer.id}`}>{customer.email}</span>
                                </div>
                              )}
                              {customer.phone && (
                                <div className="flex items-center space-x-1 text-sm">
                                  <Phone className="w-3 h-3 text-muted-foreground" />
                                  <span data-testid={`customer-phone-${customer.id}`}>{customer.phone}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {customer.address ? (
                              <div className="flex items-start space-x-1 text-sm">
                                <MapPin className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <span className="text-muted-foreground" data-testid={`customer-address-${customer.id}`}>
                                  {customer.address}
                                  {customer.city && `, ${customer.city}`}
                                  {customer.state && `, ${customer.state}`}
                                  {customer.zipCode && ` ${customer.zipCode}`}
                                </span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">No address</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-medium" data-testid={`customer-jobs-${customer.id}`}>
                              -
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground" data-testid={`customer-last-service-${customer.id}`}>
                              -
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-medium" data-testid={`customer-total-spent-${customer.id}`}>
                              -
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                data-testid={`button-view-customer-${customer.id}`}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                data-testid={`button-edit-customer-${customer.id}`}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => deleteCustomerMutation.mutate(customer.id)}
                                data-testid={`button-delete-customer-${customer.id}`}
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
