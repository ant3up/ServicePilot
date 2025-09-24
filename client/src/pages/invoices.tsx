import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { InvoiceForm } from "@/components/invoices/invoice-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SendInvoiceModal } from "@/components/invoices/send-invoice-modal";
import { Plus, Filter, FileText, Send, Edit, Trash, Eye, Download } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Invoices() {
  const [showForm, setShowForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: invoices, isLoading } = useQuery({
    queryKey: ["/api/invoices"],
  });

  const deleteInvoiceMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/invoices/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      toast({ title: "Invoice deleted successfully" });
    },
    onError: () => {
      toast({ 
        title: "Error", 
        description: "Failed to delete invoice",
        variant: "destructive" 
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-blue-100 text-blue-800";
      case "paid":
        return "bg-green-100 text-green-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const handleSendInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setShowSendModal(true);
  };

  const handleEditInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setShowForm(true);
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
                  Invoices
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage invoices and track payments from your customers.
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
                  data-testid="button-new-invoice"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Invoice
                </Button>
              </div>
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
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
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

            {/* Invoices Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(invoices as any[] || []).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex flex-col items-center space-y-2">
                            <FileText className="w-8 h-8 text-muted-foreground" />
                            <p className="text-muted-foreground">No invoices found</p>
                            <Button size="sm" data-testid="button-create-first-invoice">
                              onClick={() => setShowForm(true)}
                              Create your first invoice
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      (invoices as any[] || []).map((invoice: any) => (
                        <TableRow key={invoice.id} data-testid={`invoice-row-${invoice.id}`}>
                          <TableCell className="font-medium" data-testid={`invoice-number-${invoice.id}`}>
                            {invoice.invoiceNumber}
                          </TableCell>
                          <TableCell data-testid={`invoice-customer-${invoice.id}`}>
                            {invoice.customer?.firstName} {invoice.customer?.lastName}
                          </TableCell>
                          <TableCell data-testid={`invoice-amount-${invoice.id}`}>
                            ${parseFloat(invoice.total || "0").toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={getStatusColor(invoice.status)}
                              data-testid={`invoice-status-${invoice.id}`}
                            >
                              {invoice.status}
                            </Badge>
                          </TableCell>
                          <TableCell data-testid={`invoice-due-${invoice.id}`}>
                            {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '-'}
                          </TableCell>
                          <TableCell data-testid={`invoice-created-${invoice.id}`}>
                            {new Date(invoice.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                data-testid={`button-view-invoice-${invoice.id}`}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                data-testid={`button-download-invoice-${invoice.id}`}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleSendInvoice(invoice)}
                                data-testid={`button-send-invoice-${invoice.id}`}
                              >
                                <Send className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleEditInvoice(invoice)}
                                data-testid={`button-edit-invoice-${invoice.id}`}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => deleteInvoiceMutation.mutate(invoice.id)}
                                data-testid={`button-delete-invoice-${invoice.id}`}
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

      {/* Invoice Form Modal */}
      {showForm && (
        <InvoiceForm 
          invoice={selectedInvoice}
          onClose={() => {
            setShowForm(false);
            setSelectedInvoice(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setSelectedInvoice(null);
            queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
          }}
        />
      )}

      {/* Send Invoice Modal */}
      {showSendModal && selectedInvoice && (
        <SendInvoiceModal
          invoice={selectedInvoice}
          onClose={() => {
            setShowSendModal(false);
            setSelectedInvoice(null);
          }}
          onSuccess={() => {
            setShowSendModal(false);
            setSelectedInvoice(null);
            queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
          }}
        />
      )}
    </div>
  );
}
