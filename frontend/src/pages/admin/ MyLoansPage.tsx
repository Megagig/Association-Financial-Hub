import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
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
  CircleDollarSign,
  FileText,
  Download,
  Filter,
  CircleCheck,
  Clock,
  BanknoteIcon,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { LoanStatus } from '@/types';

export default function MyLoansPage() {
  const { user } = useAuth();
  const {
    members,
    loans,
    getMemberById,
    getMemberLoans,
    applyForLoan,
    isLoading,
  } = useData();

  const { toast } = useToast();

  const [loanAmount, setLoanAmount] = useState<string>('');
  const [loanPurpose, setLoanPurpose] = useState<string>('');
  const [isSubmittingLoan, setIsSubmittingLoan] = useState(false);

  const [isRepaymentDialogOpen, setIsRepaymentDialogOpen] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
  const [repaymentAmount, setRepaymentAmount] = useState<string>('');

  if (isLoading || !user) {
    return <div className="text-center py-10">Loading loans data...</div>;
  }

  const member = getMemberById(user.id);
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

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Handle loan application
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

      // Reset form
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

  // Handle loan repayment
  const openRepaymentDialog = (loanId: string) => {
    setSelectedLoanId(loanId);
    setIsRepaymentDialogOpen(true);
  };

  const handleRepayment = () => {
    toast({
      title: 'Repayment Submitted',
      description: 'Your loan repayment has been submitted successfully.',
    });
    setIsRepaymentDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusIcon = (status: LoanStatus) => {
    switch (status) {
      case LoanStatus.APPROVED:
        return <CircleCheck className="h-4 w-4 text-success" />;
      case LoanStatus.PENDING:
        return <Clock className="h-4 w-4 text-warning" />;
      case LoanStatus.REJECTED:
        return <AlertCircle className="h-4 w-4 text-error" />;
      case LoanStatus.PAID:
        return <BanknoteIcon className="h-4 w-4 text-success" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Loans</h2>
        <p className="text-muted-foreground">
          View and manage your loan applications and repayments
        </p>
      </div>

      <Tabs defaultValue="loans">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="loans">Loan History</TabsTrigger>
          <TabsTrigger value="apply">Apply for Loan</TabsTrigger>
        </TabsList>

        <TabsContent value="loans" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Loan Applications</CardTitle>
                <CardDescription>
                  History of your loan applications
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {memberLoans.length > 0 ? (
                <div className="space-y-6">
                  {memberLoans.map((loan) => (
                    <div key={loan.id} className="border rounded-lg p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                        <div>
                          <h3 className="font-medium">{loan.purpose}</h3>
                          <p className="text-sm text-muted-foreground">
                            Applied: {formatDate(loan.applicationDate)}
                          </p>
                        </div>
                        <div className="flex items-center mt-2 sm:mt-0">
                          {getStatusIcon(loan.status)}
                          <StatusBadge status={loan.status} className="ml-2" />
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3 my-3">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Amount
                          </p>
                          <p className="font-medium">
                            {formatCurrency(loan.amount)}
                          </p>
                        </div>
                        {loan.approvalDate && (
                          <div>
                            <p className="text-xs text-muted-foreground">
                              {loan.status === LoanStatus.APPROVED
                                ? 'Approved Date'
                                : 'Reviewed Date'}
                            </p>
                            <p className="font-medium">
                              {formatDate(loan.approvalDate)}
                            </p>
                          </div>
                        )}
                        {loan.dueDate && (
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Due Date
                            </p>
                            <p className="font-medium">
                              {formatDate(loan.dueDate)}
                            </p>
                          </div>
                        )}
                      </div>

                      {loan.status === LoanStatus.APPROVED && (
                        <div className="mt-4">
                          <Button onClick={() => openRepaymentDialog(loan.id)}>
                            <CircleDollarSign className="h-4 w-4 mr-2" />
                            Make Repayment
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No Loan History</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You haven't applied for any loans yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="apply" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Apply for a Loan</CardTitle>
              <CardDescription>
                Request financial assistance from the alumni association
              </CardDescription>
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

                <div className="space-y-2">
                  <Label htmlFor="repayment-plan">
                    Proposed Repayment Plan
                  </Label>
                  <select
                    id="repayment-plan"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  >
                    <option value="">Select a repayment plan</option>
                    <option value="3-months">3 months</option>
                    <option value="6-months">6 months</option>
                    <option value="12-months">12 months</option>
                    <option value="24-months">24 months</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supporting-documents">
                    Supporting Documents (Optional)
                  </Label>
                  <Input
                    id="supporting-documents"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    multiple
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload any supporting documents that may help with your loan
                    application.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmittingLoan}
                >
                  {isSubmittingLoan ? 'Submitting...' : 'Submit Application'}
                </Button>

                <p className="text-xs text-muted-foreground mt-2">
                  By submitting this application, you agree to the terms and
                  conditions of the alumni loan program.
                </p>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog
        open={isRepaymentDialogOpen}
        onOpenChange={setIsRepaymentDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Make a Loan Repayment</DialogTitle>
            <DialogDescription>
              Submit a payment towards your approved loan
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="repayment-amount">Repayment Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="repayment-amount"
                  type="number"
                  placeholder="0.00"
                  className="pl-7"
                  value={repaymentAmount}
                  onChange={(e) => setRepaymentAmount(e.target.value)}
                  required
                  min="1"
                  step="0.01"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment-method">Payment Method</Label>
              <select
                id="payment-method"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="credit-card">Credit Card</option>
                <option value="bank-transfer">Bank Transfer</option>
                <option value="cash">Cash</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="receipt">Upload Receipt (Optional)</Label>
              <Input id="receipt" type="file" accept="image/*,.pdf" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any additional information about this repayment"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRepaymentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleRepayment}>Submit Repayment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
