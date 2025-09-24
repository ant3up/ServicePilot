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
import { QuoteForm } from "@/components/quotes/quote-form";
import { SendQuoteModal } from "@/components/quotes/send-quote-modal";
import { Plus, Filter, FileText, Send, Edit, Trash, Eye } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Quotes() {
  const [showForm, setShowForm] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: quotes, isLoading } = useQuery({
    queryKey: ["/api/quotes"],
  });

  const deleteQuoteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/quotes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
      toast({ title: "Quote deleted successfully" });
    },
    onError: () => {
      toast({ 
        title: "Error", 
        description: "Failed to delete quote",
        variant: "destructive" 
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-blue-100 text-blue-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "declined":
        return "bg-red-100 text-red-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const handleSendQuote = (quote: any) => {
    setSelectedQuote(quote);
    setShowSendModal(true);
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
                  Quotes
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage and send professional quotes to your customers.
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
                  data-testid="button-new-quote"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Quote
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
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="declined">Declined</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
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

            {/* Quotes Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Quote #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quotes?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex flex-col items-center space-y-2">
                            <FileText className="w-8 h-8 text-muted-foreground" />
                            <p className="text-muted-foreground">No quotes found</p>
                            <Button 
                              onClick={() => setShowForm(true)}
                              size="sm"
                              data-testid="button-create-first-quote"
                            >
                              Create your first quote
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      quotes?.map((quote: any) => (
                        <TableRow key={quote.id} data-testid={`quote-row-${quote.id}`}>
                          <TableCell className="font-medium" data-testid={`quote-number-${quote.id}`}>
                            {quote.quoteNumber}
                          </TableCell>
                          <TableCell data-testid={`quote-customer-${quote.id}`}>
                            {quote.customer?.firstName} {quote.customer?.lastName}
                          </TableCell>
                          <TableCell data-testid={`quote-title-${quote.id}`}>
                            {quote.title}
                          </TableCell>
                          <TableCell data-testid={`quote-total-${quote.id}`}>
                            ${parseFloat(quote.total || "0").toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={getStatusColor(quote.status)}
                              data-testid={`quote-status-${quote.id}`}
                            >
                              {quote.status}
                            </Badge>
                          </TableCell>
                          <TableCell data-testid={`quote-created-${quote.id}`}>
                            {new Date(quote.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                data-testid={`button-view-quote-${quote.id}`}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleSendQuote(quote)}
                                data-testid={`button-send-quote-${quote.id}`}
                              >
                                <Send className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                data-testid={`button-edit-quote-${quote.id}`}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => deleteQuoteMutation.mutate(quote.id)}
                                data-testid={`button-delete-quote-${quote.id}`}
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

      {/* Quote Form Modal */}
      {showForm && (
        <QuoteForm 
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
          }}
        />
      )}

      {/* Send Quote Modal */}
      {showSendModal && selectedQuote && (
        <SendQuoteModal
          quote={selectedQuote}
          onClose={() => {
            setShowSendModal(false);
            setSelectedQuote(null);
          }}
          onSuccess={() => {
            setShowSendModal(false);
            setSelectedQuote(null);
            queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
          }}
        />
      )}
    </div>
  );
}
