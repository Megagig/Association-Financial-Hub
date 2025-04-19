import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useState } from 'react';
import { StatCard } from '@/components/Dashboard/StatCard';
import { StatusBadge } from '@/components/Dashboard/StatusBadge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import {
  CircleDollarSign,
  CreditCard,
  FileText,
  GiftIcon,
  Upload,
  AlertCircle,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { PaymentStatus, LoanStatus } from '@/types';

export default function MemberDashboard() {
  const { user } = useAuth();
  const {
    members,
    payments,
    loans,
    getMemberById,
    getMemberPayments,
    getMemberLoans,
    addPayment,
    applyForLoan,
    isLoading,
  } = useData();

  const { toast } = useToast();

  const [paymentType, setPaymentType] = useState<
    'dues' | 'donation' | 'pledge'
  >('dues');
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentDescription, setPaymentDescription] = useState<string>('');
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  const [loanAmount, setLoanAmount] = useState<string>('');
  const [loanPurpose, setLoanPurpose] = useState<string>('');
  const [isSubmittingLoan, setIsSubmittingLoan] = useState(false);

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(
    null
  );

  if (isLoading || !user) {
    return <div className="text-center py-10">Loading dashboard data...</div>;
  }

  const member = getMemberById(user.id);
  const memberPayments = getMemberPayments(user.id);
  const memberLoans = getMemberLoans(user.id);

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

  const handleLoanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingLoan(true);

    try {
      const amount = parseFloat(loanAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid amount');
      }

      if (!loanPurpose) {
        throw new Error('Please enter the purpose of the loan');
      }

      await applyForLoan({
        userId: user.id,
        amount,
        purpose: loanPurpose,
      });

      toast({
        title: 'Loan Application Submitted',
        description:
          'Your loan application has been submitted and is awaiting approval.',
      });

      setLoanAmount('');
      setLoanPurpose('');
    } catch (error) {
      toast({
        title: 'Application Failed',
        description:
          error instanceof Error
            ? error.message
            : 'An error occurred while processing your application',
        variant: 'destructive',
      });
    } finally {
      setIsSubmittingLoan(false);
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome, {member.name}
        </h2>
        <p className="text-muted-foreground">
          Member ID: {member.membershipId} | Joined:{' '}
          {new Date(member.memberSince).toLocaleDateString()}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Dues Paid"
          value={formatCurrency(member.totalDuesPaid)}
          icon={CreditCard}
          iconColor="text-success"
        />
        <StatCard
          title="Dues Owing"
          value={formatCurrency(member.duesOwing)}
          icon={FileText}
          iconColor={member.duesOwing > 0 ? 'text-error' : 'text-success'}
        />
        <StatCard
          title="Total Donations"
          value={formatCurrency(member.totalDonations)}
          icon={GiftIcon}
          iconColor="text-blue-royal"
        />
        <StatCard
          title="Active Loans"
          value={member.activeLoans}
          description={
            member.loanBalance > 0
              ? `Balance: ${formatCurrency(member.loanBalance)}`
              : undefined
          }
          icon={CircleDollarSign}
          iconColor={member.loanBalance > 0 ? 'text-warning' : 'text-success'}
        />
      </div>

      <Tabs defaultValue="payments">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="payments">Payments & Dues</TabsTrigger>
          <TabsTrigger value="loans">Loans</TabsTrigger>
          <TabsTrigger value="actions">Quick Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Your recent payment activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {memberPayments.length > 0 ? (
                  memberPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between space-x-4 border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none capitalize">
                          {payment.type}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {payment.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(payment.date).toLocaleDateString()}(
                          {formatDistanceToNow(new Date(payment.date), {
                            addSuffix: true,
                          })}
                          )
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {formatCurrency(payment.amount)}
                          </p>
                          <div className="flex items-center justify-end mt-1">
                            <StatusBadge status={payment.status} />
                            {payment.status === PaymentStatus.PENDING &&
                              !payment.receiptUrl && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 ml-2"
                                  onClick={() =>
                                    handleUploadReceipt(payment.id)
                                  }
                                >
                                  <Upload className="h-3 w-3 mr-1" />
                                  Upload
                                </Button>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No payment history found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Loan History</CardTitle>
              <CardDescription>
                Your loan applications and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {memberLoans.length > 0 ? (
                  memberLoans.map((loan) => (
                    <div
                      key={loan.id}
                      className="flex items-center justify-between space-x-4 border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {loan.purpose}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Applied:{' '}
                          {new Date(loan.applicationDate).toLocaleDateString()}(
                          {formatDistanceToNow(new Date(loan.applicationDate), {
                            addSuffix: true,
                          })}
                          )
                        </p>
                        {loan.approvalDate && (
                          <p className="text-xs text-muted-foreground">
                            {loan.status === LoanStatus.APPROVED
                              ? 'Approved'
                              : 'Rejected'}
                            : {new Date(loan.approvalDate).toLocaleDateString()}
                          </p>
                        )}
                        {loan.dueDate && (
                          <p className="text-xs text-muted-foreground">
                            Due: {new Date(loan.dueDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {formatCurrency(loan.amount)}
                          </p>
                          <div className="flex items-center justify-end mt-1">
                            <StatusBadge status={loan.status} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No loan history found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Make a Payment</CardTitle>
                <CardDescription>Pay dues or make a donation</CardDescription>
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

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmittingPayment}
                  >
                    {isSubmittingPayment ? 'Processing...' : 'Submit Payment'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Apply for a Loan</CardTitle>
                <CardDescription>Request financial assistance</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLoanSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="loan-amount">Loan Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="loan-amount"
                        type="number"
                        placeholder="0.00"
                        className="pl-7"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(e.target.value)}
                        required
                        min="1"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="loan-purpose">Purpose</Label>
                    <Textarea
                      id="loan-purpose"
                      placeholder="Describe the purpose of this loan"
                      value={loanPurpose}
                      onChange={(e) => setLoanPurpose(e.target.value)}
                      rows={3}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmittingLoan}
                  >
                    {isSubmittingLoan ? 'Submitting...' : 'Apply for Loan'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
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
