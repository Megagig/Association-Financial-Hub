import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useState } from 'react';
import { StatusBadge } from '@/components/Dashboard/StatusBadge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertCircle,
  CreditCard,
  FileText,
  Upload,
  MessageSquare,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { PaymentStatus } from '@/types';

export default function MyPaymentsPage() {
  const { user } = useAuth();
  const { getMemberById, getMemberPayments, addPayment, isLoading } = useData();
  const { toast } = useToast();

  const [paymentType, setPaymentType] = useState<
    'dues' | 'donation' | 'pledge'
  >('dues');
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentDescription, setPaymentDescription] = useState<string>('');
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(
    null
  );

  const ADMIN_WHATSAPP = '+1234567890'; // Replace with actual admin WhatsApp number

  if (isLoading || !user) {
    return <div className="text-center py-10">Loading payments data...</div>;
  }

  const member = getMemberById(user.id);
  const payments = getMemberPayments(user.id);

  if (!member) {
    return (
      <div className="text-center py-10">
        <AlertCircle className="h-10 w-10 text-error mx-auto mb-4" />
        <h2 className="text-xl font-semibold">Member profile not found</h2>
        <p className="text-muted-foreground mt-2">
          Please contact an administrator for assistance.
        </p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPayment(true);

    try {
      const amount = parseFloat(paymentAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid amount');
      }

      await addPayment({
        userId: user.id,
        amount,
        type: paymentType,
        description: paymentDescription || `${paymentType} payment`,
        date: new Date().toISOString(),
        status: PaymentStatus.PENDING,
      });

      toast({
        title: 'Payment Submitted',
        description:
          'Your payment has been submitted and is awaiting approval.',
      });

      setPaymentAmount('');
      setPaymentDescription('');
    } catch (error) {
      toast({
        title: 'Payment Failed',
        description:
          error instanceof Error
            ? error.message
            : 'An error occurred while processing your payment',
        variant: 'destructive',
      });
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const handleUploadReceipt = (paymentId: string) => {
    setSelectedPaymentId(paymentId);
    setIsUploadDialogOpen(true);
  };

  const submitReceiptUpload = () => {
    toast({
      title: 'Receipt Uploaded',
      description:
        'Your receipt has been uploaded and is awaiting verification.',
    });
    setIsUploadDialogOpen(false);
  };

  const handleSendViaWhatsApp = (paymentId: string) => {
    const payment = payments.find((p) => p.id === paymentId);
    if (!payment) return;

    const message = `Hello, I'm sending a receipt for my payment: ${
      payment.description
    } - Amount: ${formatCurrency(payment.amount)} - Date: ${new Date(
      payment.date
    ).toLocaleDateString()} - Payment ID: ${payment.id}`;
    const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Payments</h2>
        <p className="text-muted-foreground">
          View and manage your payment history
        </p>
      </div>

      <Tabs defaultValue="history">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="history">Payment History</TabsTrigger>
          <TabsTrigger value="make-payment">Make a Payment</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Your payment records and status</CardDescription>
            </CardHeader>
            <CardContent>
              {payments.length > 0 ? (
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary mr-2">
                            <CreditCard className="h-4 w-4" />
                          </span>
                          <span className="text-sm font-medium capitalize">
                            {payment.type}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground ml-10">
                          {payment.description}
                        </p>
                        <p className="text-xs text-muted-foreground ml-10">
                          {new Date(payment.date).toLocaleDateString()}(
                          {formatDistanceToNow(new Date(payment.date), {
                            addSuffix: true,
                          })}
                          )
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 ml-10 sm:ml-0">
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {formatCurrency(payment.amount)}
                          </p>
                          <div className="flex items-center justify-end mt-1">
                            <StatusBadge status={payment.status} />
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          {payment.status === PaymentStatus.PENDING &&
                            !payment.receiptUrl && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7"
                                  onClick={() =>
                                    handleUploadReceipt(payment.id)
                                  }
                                >
                                  <Upload className="h-3 w-3 mr-1" />
                                  Upload Receipt
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7"
                                  onClick={() =>
                                    handleSendViaWhatsApp(payment.id)
                                  }
                                >
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  Send via WhatsApp
                                </Button>
                              </>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No Payment History</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You haven't made any payments yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="make-payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Make a Payment</CardTitle>
              <CardDescription>
                Pay dues or make a donation to the alumni association
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="payment-type">Payment Type</Label>
                  <select
                    id="payment-type"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value as any)}
                    required
                  >
                    <option value="dues">Membership Dues</option>
                    <option value="donation">Donation</option>
                    <option value="pledge">Pledge</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment-amount">Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="payment-amount"
                      type="number"
                      placeholder="0.00"
                      className="pl-7"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      required
                      min="1"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment-description">
                    Description (Optional)
                  </Label>
                  <Textarea
                    id="payment-description"
                    placeholder="Enter a description for this payment"
                    value={paymentDescription}
                    onChange={(e) => setPaymentDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment-method">Payment Method</Label>
                  <select
                    id="payment-method"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  >
                    <option value="">Select a payment method</option>
                    <option value="bank-transfer">Bank Transfer</option>
                    <option value="cash">Cash</option>
                    <option value="mobile-money">Mobile Money</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmittingPayment}
                >
                  {isSubmittingPayment ? 'Processing...' : 'Submit Payment'}
                </Button>

                <div className="text-center pt-4">
                  <p className="text-sm font-medium">
                    Need help with your payment?
                  </p>
                  <Button
                    variant="link"
                    className="text-primary p-0"
                    onClick={() =>
                      window.open(`https://wa.me/${ADMIN_WHATSAPP}`, '_blank')
                    }
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Contact Admin via WhatsApp
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Payment Receipt</DialogTitle>
            <DialogDescription>
              Upload a receipt or proof of payment for verification
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="receipt">Receipt Document</Label>
              <Input id="receipt" type="file" accept="image/*,.pdf" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any additional information about this receipt"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUploadDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={submitReceiptUpload}>Upload Receipt</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
