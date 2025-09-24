import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FileText, Mail, Link as LinkIcon, DollarSign } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const sendInvoiceSchema = z.object({
  to: z.string().email("Please enter a valid email address"),
  cc: z.string().optional(),
  bcc: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
  attachPdf: z.boolean().default(true),
  enablePartialPayments: z.boolean().default(false),
  sendSmsWithPaymentLink: z.boolean().default(false),
});

type SendInvoiceData = z.infer<typeof sendInvoiceSchema>;

interface SendInvoiceModalProps {
  invoice: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function SendInvoiceModal({ invoice, onClose, onSuccess }: SendInvoiceModalProps) {
  const [activeTab, setActiveTab] = useState("email");
  const { toast } = useToast();

  const form = useForm<SendInvoiceData>({
    resolver: zodResolver(sendInvoiceSchema),
    defaultValues: {
      to: invoice?.customer?.email || "",
      cc: "",
      bcc: "",
      subject: `Invoice #${invoice?.invoiceNumber || ''} from Call Mate`,
      message: `Hi ${invoice?.customer?.firstName || "Customer"}, please find your invoice attached. You can pay securely using the link below.`,
      attachPdf: true,
      enablePartialPayments: false,
      sendSmsWithPaymentLink: false,
    },
  });

  const sendInvoiceMutation = useMutation({
    mutationFn: async (data: SendInvoiceData) => {
      await apiRequest("POST", `/api/invoices/${invoice.id}/send`, data);
    },
    onSuccess: () => {
      toast({ title: "Invoice sent successfully" });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send invoice",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SendInvoiceData) => {
    sendInvoiceMutation.mutate(data);
  };

  const customerName = invoice?.customer 
    ? `${invoice.customer.firstName} ${invoice.customer.lastName}`
    : "Customer";

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Send Invoice</span>
          </DialogTitle>
          <DialogDescription>
            Review recipients and message before sending the invoice.
          </DialogDescription>
        </DialogHeader>

        {/* Invoice Summary */}
        <Card className="bg-muted/30">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">PDF + 1</Badge>
                  <Badge variant="outline">Payment link</Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Not sent
                  </Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">To</span>
                    <span className="font-medium">{invoice?.customer?.email || "customer@email.com"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subject</span>
                    <span className="font-medium">Invoice #{invoice?.invoiceNumber || ''} from Call Mate</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount Due</span>
                    <span className="font-medium">${parseFloat(invoice?.total || "0").toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="bg-background p-3 rounded border text-sm">
                <p className="font-medium mb-2">Message preview...</p>
                <p className="text-muted-foreground">
                  Hi {invoice?.customer?.firstName || "Customer"}, please find your invoice attached...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email" className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>PDF + 1</span>
            </TabsTrigger>
            <TabsTrigger value="link" className="flex items-center space-x-2">
              <LinkIcon className="w-4 h-4" />
              <span>Payment link</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Recipients</h4>
                  
                  <FormField
                    control={form.control}
                    name="to"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>To</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="customer@email.com"
                            data-testid="input-email-to"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="cc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CC (optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="cc@email.com"
                              data-testid="input-email-cc"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bcc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>BCC (optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="bcc@email.com"
                              data-testid="input-email-bcc"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input
                          data-testid="input-email-subject"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={6}
                          data-testid="textarea-email-message"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="attachPdf"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="switch-attach-pdf"
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          Attach PDF copy
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="enablePartialPayments"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="switch-partial-payments"
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          Enable partial payments
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sendSmsWithPaymentLink"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="switch-sms-payment-link"
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          Send SMS with payment link
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter className="flex justify-between">
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      data-testid="button-back"
                      onClick={onClose}
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      data-testid="button-preview-pdf"
                    >
                      Preview PDF
                    </Button>
                  </div>
                  <Button
                    type="submit"
                    disabled={sendInvoiceMutation.isPending}
                    data-testid="button-send-now"
                  >
                    {sendInvoiceMutation.isPending ? "Sending..." : "Send Now"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="link" className="space-y-4">
            <div className="text-center space-y-4">
              <div className="p-6 border-2 border-dashed border-muted rounded-lg">
                <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h4 className="font-medium mb-2">Share Payment Link</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Generate a secure link that customers can use to view and pay the invoice online.
                </p>
                <div className="flex items-center space-x-2">
                  <Input
                    readOnly
                    value={`https://callmate.app/invoice/${invoice?.id || 'abc123'}/pay`}
                    className="font-mono text-xs"
                    data-testid="input-payment-link"
                  />
                  <Button size="sm" data-testid="button-copy-link">
                    Copy Link
                  </Button>
                </div>
              </div>
              
              <div className="text-left space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch data-testid="switch-sms-link" />
                  <Label className="text-sm">Send link via SMS</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch data-testid="switch-email-link" />
                  <Label className="text-sm">Send link via email</Label>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
