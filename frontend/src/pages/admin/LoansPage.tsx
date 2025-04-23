import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Loan, LoanStatus } from '@/types';
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
  DialogTrigger,
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
  Search,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

export default function LoansPage() {
  const { user, isAdmin } = useAuth();
  const { members, loans, getMemberById, updateLoanStatus, isLoading } =
    useData();

  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
  const [isProcessingLoan, setIsProcessingLoan] = useState(false);
  const [loanActionDialogOpen, setLoanActionDialogOpen] = useState(false);
  const [loanAction, setLoanAction] = useState<'approve' | 'reject' | null>(
    null
  );
  const [processingNotes, setProcessingNotes] = useState<string>('');

  if (isLoading || !user) {
    return <div className="text-center py-10">Loading loans data...</div>;
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

  // Handle loan approval/rejection
  const openLoanActionDialog = (
    loanId: string,
    action: 'approve' | 'reject'
  ) => {
    setSelectedLoanId(loanId);
    setLoanAction(action);
    setLoanActionDialogOpen(true);
  };

  const handleLoanAction = async () => {
    if (!selectedLoanId || !loanAction) return;

    setIsProcessingLoan(true);

    try {
      const newStatus =
        loanAction === 'approve' ? LoanStatus.APPROVED : LoanStatus.REJECTED;
      await updateLoanStatus(selectedLoanId, newStatus);

      toast({
        title: `Loan ${loanAction === 'approve' ? 'Approved' : 'Rejected'}`,
        description: `The loan has been successfully ${
          loanAction === 'approve' ? 'approved' : 'rejected'
        }.`,
      });

      setLoanActionDialogOpen(false);
      setProcessingNotes('');
    } catch (error) {
      toast({
        title: 'Action Failed',
        description: 'There was an error processing the loan.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessingLoan(false);
    }
  };

  // Filter loans based on search term
  const filteredLoans = Array.isArray(loans)
    ? loans.filter((loan) => {
        const member = getMemberById(loan?.userId);
        if (!member) return false;

        const searchLowerCase = searchTerm.toLowerCase();
        return (
          member.name?.toLowerCase().includes(searchLowerCase) ||
          member.membershipId?.toLowerCase().includes(searchLowerCase) ||
          loan.purpose?.toLowerCase().includes(searchLowerCase)
        );
      })
    : [];

  // Add early return for no loans
  if (!Array.isArray(loans)) {
    return (
      <div className="text-center py-10">
        <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium">No Loans Available</h3>
        <p className="text-sm text-muted-foreground mt-1">
          There seems to be an issue loading the loans data.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Loans Management</h2>
        <p className="text-muted-foreground">
          Review and manage loan applications from members
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Loan Applications</CardTitle>
            <CardDescription>
              All loan applications from members
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search loans..."
                className="w-[200px] sm:w-[300px] pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredLoans.length > 0 ? (
            <div className="space-y-6">
              {filteredLoans.map((loan) => {
                const member = getMemberById(loan.userId);

                if (!member) {
                  return null; // Skip if member not found
                }

                return (
                  <div key={loan.id} className="border rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium">{loan.purpose}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Member: {member.name} (ID: {member.membershipId})
                        </p>
                      </div>
                      <div className="flex items-center mt-2 sm:mt-0">
                        {getStatusIcon(loan.status)}
                        <StatusBadge status={loan.status} className="ml-2" />
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-4 my-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Amount</p>
                        <p className="font-medium">
                          {formatCurrency(loan.amount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Application Date
                        </p>
                        <p className="font-medium">
                          {formatDate(loan.applicationDate)}
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

                    {loan.status === LoanStatus.PENDING && (
                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="default"
                          onClick={() =>
                            openLoanActionDialog(loan.id, 'approve')
                          }
                        >
                          <CircleCheck className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() =>
                            openLoanActionDialog(loan.id, 'reject')
                          }
                        >
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10">
              <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No Loans Found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {searchTerm
                  ? 'No loans match your search criteria.'
                  : 'There are no loan applications to display.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Loan Action Dialog */}
      <Dialog
        open={loanActionDialogOpen}
        onOpenChange={setLoanActionDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {loanAction === 'approve' ? 'Approve Loan' : 'Reject Loan'}
            </DialogTitle>
            <DialogDescription>
              {loanAction === 'approve'
                ? 'Approve this loan application and set the terms.'
                : 'Reject this loan application and provide a reason.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="processing-notes">
                {loanAction === 'approve'
                  ? 'Approval Notes'
                  : 'Rejection Reason'}
              </Label>
              <Textarea
                id="processing-notes"
                placeholder={
                  loanAction === 'approve'
                    ? 'Add any notes about this approval...'
                    : 'Provide a reason for rejecting this application...'
                }
                value={processingNotes}
                onChange={(e) => setProcessingNotes(e.target.value)}
                rows={3}
              />
            </div>

            {loanAction === 'approve' && (
              <div className="space-y-2">
                <Label htmlFor="repayment-terms">Repayment Terms</Label>
                <select
                  id="repayment-terms"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  defaultValue="12_months"
                >
                  <option value="3_months">3 months</option>
                  <option value="6_months">6 months</option>
                  <option value="12_months">12 months</option>
                  <option value="24_months">24 months</option>
                </select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setLoanActionDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleLoanAction} disabled={isProcessingLoan}>
              {isProcessingLoan
                ? 'Processing...'
                : loanAction === 'approve'
                ? 'Approve Loan'
                : 'Reject Loan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
