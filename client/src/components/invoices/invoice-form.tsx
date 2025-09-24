import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  rate: z.number().min(0, "Rate must be positive"),
});

const invoiceFormSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  jobId: z.string().optional(),
  dueDate: z.date().optional(),
  notes: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
});

type InvoiceFormData = z.infer<typeof invoiceFormSchema>;

interface InvoiceFormProps {
  onClose: () => void;
  onSuccess: () => void;
  invoice?: any;
}

export function InvoiceForm({ onClose, onSuccess, invoice }: InvoiceFormProps) {
  const [items, setItems] = useState([
    { description: "Service description", quantity: 1, rate: 0 },
    { description: "Materials / parts", quantity: 1, rate: 0 }
  ]);
  const { toast } = useToast();

  const { data: customers } = useQuery({
    queryKey: ["/api/customers"],
  });

  const { data: jobs } = useQuery({
    queryKey: ["/api/jobs"],
  });

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      customerId: invoice?.customerId || "",
      jobId: invoice?.jobId || "",
      dueDate: invoice?.dueDate ? new Date(invoice.dueDate) : undefined,
      notes: invoice?.notes || "",
      items: invoice?.items || [
        { description: "Service description", quantity: 1, rate: 0 },
        { description: "Materials / parts", quantity: 1, rate: 0 }
      ],
    },
  });

  const createInvoiceMutation = useMutation({
    mutationFn: async (data: InvoiceFormData) => {
      const subtotal = data.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
      const tax = subtotal * 0.0825; // 8.25% tax rate
      const total = subtotal + tax;

      const invoiceData = {
        ...data,
        subtotal: subtotal.toString(),
        tax: tax.toString(),
        total: total.toString(),
      };

      if (invoice) {
        await apiRequest("PATCH", `/api/invoices/${invoice.id}`, invoiceData);
      } else {
        await apiRequest("POST", "/api/invoices", invoiceData);
      }
    },
    onSuccess: () => {
      toast({ title: `Invoice ${invoice ? 'updated' : 'created'} successfully` });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to ${invoice ? 'update' : 'create'} invoice`,
        variant: "destructive",
      });
    },
  });

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, rate: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
    form.setValue('items', newItems);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.0825;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const onSubmit = (data: InvoiceFormData) => {
    createInvoiceMutation.mutate({ ...data, items });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle data-testid="text-invoice-form-title">
            {invoice ? 'Edit Invoice' : 'New Invoice'}
          </DialogTitle>
          <DialogDescription>
            {invoice ? 'Update invoice details and line items.' : 'Create a new invoice for your customer.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Invoice Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Invoice # (auto)</label>
                    <Input 
                      value={`INV-${Date.now()}`}
                      disabled
                      className="bg-muted"
                      data-testid="input-invoice-number"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Issue date</label>
                      <Input 
                        type="date"
                        defaultValue={new Date().toISOString().split('T')[0]}
                        data-testid="input-issue-date"
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="dueDate"
                      render={({ field }) => (
                        <FormItem>
                          <label className="text-sm font-medium text-muted-foreground">Due date</label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                  data-testid="button-due-date"
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date()
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="customerId"
                    render={({ field }) => (
                      <FormItem>
                        <label className="text-sm font-medium text-muted-foreground">Bill to (customer)</label>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-customer">
                              <SelectValue placeholder="Select a customer" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {customers?.map((customer: any) => (
                              <SelectItem key={customer.id} value={customer.id}>
                                {customer.firstName} {customer.lastName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Billing address</label>
                    <Textarea 
                      placeholder="Customer billing address..."
                      rows={3}
                      data-testid="textarea-billing-address"
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="jobId"
                    render={({ field }) => (
                      <FormItem>
                        <label className="text-sm font-medium text-muted-foreground">Related job (optional)</label>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-related-job">
                              <SelectValue placeholder="Select a job" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {jobs?.map((job: any) => (
                              <SelectItem key={job.id} value={job.id}>
                                {job.jobNumber} - {job.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Currency</label>
                      <Select defaultValue="usd">
                        <SelectTrigger data-testid="select-currency">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usd">USD ($)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Tax rate</label>
                      <Input 
                        defaultValue="8.25%"
                        disabled
                        className="bg-muted"
                        data-testid="input-tax-rate"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Line Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Line Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground">
                    <div className="col-span-5">Description</div>
                    <div className="col-span-2">Rate</div>
                    <div className="col-span-2">Qty</div>
                    <div className="col-span-2">Amount</div>
                    <div className="col-span-1"></div>
                  </div>

                  {items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center" data-testid={`invoice-item-${index}`}>
                      <div className="col-span-5">
                        <Input
                          placeholder="Service description"
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          data-testid={`input-item-description-${index}`}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                          data-testid={`input-item-rate-${index}`}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                          data-testid={`input-item-quantity-${index}`}
                        />
                      </div>
                      <div className="col-span-2">
                        <div className="h-10 px-3 py-2 border rounded-md bg-muted flex items-center text-sm">
                          ${(item.quantity * item.rate).toFixed(2)}
                        </div>
                      </div>
                      <div className="col-span-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(index)}
                          disabled={items.length === 1}
                          data-testid={`button-remove-item-${index}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addItem}
                    className="w-full"
                    data-testid="button-add-line-item"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add line item
                  </Button>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Work performed, terms, or customer notes..."
                            rows={4}
                            data-testid="textarea-invoice-notes"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Totals */}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>${calculateTax().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Discount</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Draft • Invoice not sent
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <DialogFooter className="flex justify-between">
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  data-testid="button-discard"
                >
                  Discard
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  data-testid="button-save-draft"
                >
                  Save as Draft
                </Button>
                <Button
                  type="submit"
                  disabled={createInvoiceMutation.isPending}
                  data-testid="button-send-invoice"
                >
                  {createInvoiceMutation.isPending ? "Creating..." : "Send Invoice"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}