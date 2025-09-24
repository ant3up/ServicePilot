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
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const quoteItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  rate: z.number().min(0, "Rate must be positive"),
});

const quoteFormSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  validUntil: z.date().optional(),
  notes: z.string().optional(),
  items: z.array(quoteItemSchema).min(1, "At least one item is required"),
});

type QuoteFormData = z.infer<typeof quoteFormSchema>;

interface QuoteFormProps {
  onClose: () => void;
  onSuccess: () => void;
  quote?: any;
}

export function QuoteForm({ onClose, onSuccess, quote }: QuoteFormProps) {
  const [items, setItems] = useState([
    { description: "", quantity: 1, rate: 0 }
  ]);
  const { toast } = useToast();

  const { data: customers } = useQuery({
    queryKey: ["/api/customers"],
  });

  const form = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      customerId: quote?.customerId || "",
      title: quote?.title || "",
      description: quote?.description || "",
      validUntil: quote?.validUntil ? new Date(quote.validUntil) : undefined,
      notes: quote?.notes || "",
      items: quote?.items || [{ description: "", quantity: 1, rate: 0 }],
    },
  });

  const createQuoteMutation = useMutation({
    mutationFn: async (data: QuoteFormData) => {
      const subtotal = data.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
      const tax = subtotal * 0.0825; // 8.25% tax rate
      const total = subtotal + tax;

      const quoteData = {
        ...data,
        subtotal: subtotal.toString(),
        tax: tax.toString(),
        total: total.toString(),
      };

      if (quote) {
        await apiRequest("PATCH", `/api/quotes/${quote.id}`, quoteData);
      } else {
        await apiRequest("POST", "/api/quotes", quoteData);
      }
    },
    onSuccess: () => {
      toast({ title: `Quote ${quote ? 'updated' : 'created'} successfully` });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to ${quote ? 'update' : 'create'} quote`,
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

  const onSubmit = (data: QuoteFormData) => {
    createQuoteMutation.mutate({ ...data, items });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle data-testid="text-quote-form-title">
            {quote ? 'Edit Quote' : 'Create New Quote'}
          </DialogTitle>
          <DialogDescription>
            {quote ? 'Update quote details and line items.' : 'Fill in the details to create a new quote for your customer.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
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

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quote Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., HVAC System Installation"
                        data-testid="input-quote-title"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the work to be performed..."
                      rows={3}
                      data-testid="textarea-quote-description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="validUntil"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Valid Until</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            data-testid="button-valid-until"
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

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional notes or terms..."
                        rows={3}
                        data-testid="textarea-quote-notes"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Line Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Line Items</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addItem}
                    data-testid="button-add-item"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 items-end" data-testid={`quote-item-${index}`}>
                    <div className="col-span-5">
                      <label className="text-sm font-medium">Description</label>
                      <Input
                        placeholder="Service or product description"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        data-testid={`input-item-description-${index}`}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium">Quantity</label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        data-testid={`input-item-quantity-${index}`}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium">Rate</label>
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
                      <label className="text-sm font-medium">Amount</label>
                      <div className="h-10 px-3 py-2 border rounded-md bg-muted flex items-center">
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

                {/* Totals */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (8.25%):</span>
                    <span>${calculateTax().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createQuoteMutation.isPending}
                data-testid="button-save-quote"
              >
                {createQuoteMutation.isPending ? "Saving..." : (quote ? "Update Quote" : "Create Quote")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
