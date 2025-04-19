import { useState } from 'react';
import { useData } from '@/context/DataContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { StatusBadge } from '@/components/Dashboard/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PaymentStatus } from '@/types';
import { Search, Filter, MoreHorizontal, FileDown, Eye } from 'lucide-react';

const DuesManagement = () => {
  const { members, payments, updatePaymentStatus, isLoading } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>(
    'all'
  );
  const [typeFilter, setTypeFilter] = useState<
    'all' | 'dues' | 'donation' | 'pledge'
  >('all');

  if (isLoading) {
    return <div className="text-center py-10">Loading payments data...</div>;
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Filter payments based on search query and filters
  const filteredPayments = payments.filter((payment) => {
    const member = members.find((m) => m.id === payment.userId);
    const memberName = member?.name.toLowerCase() || '';

    const matchesSearch =
      payment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memberName.includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || payment.status === statusFilter;
    const matchesType = typeFilter === 'all' || payment.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate totals
  const totalAmount = filteredPayments.reduce(
    (total, payment) => total + payment.amount,
    0
  );
  const totalPending = filteredPayments
    .filter((payment) => payment.status === PaymentStatus.PENDING)
    .reduce((total, payment) => total + payment.amount, 0);
  const totalApproved = filteredPayments
    .filter((payment) => payment.status === PaymentStatus.APPROVED)
    .reduce((total, payment) => total + payment.amount, 0);

  // Handlers
  const handleApprovePayment = async (id: string) => {
    await updatePaymentStatus(id, PaymentStatus.APPROVED);
  };

  const handleRejectPayment = async (id: string) => {
    await updatePaymentStatus(id, PaymentStatus.REJECTED);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dues Management</h2>
        <p className="text-muted-foreground">
          Manage and process member payments, dues, and donations
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {filteredPayments.length} transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalPending)}
            </div>
            <p className="text-xs text-muted-foreground">
              {
                filteredPayments.filter(
                  (p) => p.status === PaymentStatus.PENDING
                ).length
              }{' '}
              transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Approved Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalApproved)}
            </div>
            <p className="text-xs text-muted-foreground">
              {
                filteredPayments.filter(
                  (p) => p.status === PaymentStatus.APPROVED
                ).length
              }{' '}
              transactions
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
        <div className="relative w-full md:w-auto md:flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search payments..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                Status: {statusFilter === 'all' ? 'All' : statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setStatusFilter(PaymentStatus.PENDING)}
              >
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setStatusFilter(PaymentStatus.APPROVED)}
              >
                Approved
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setStatusFilter(PaymentStatus.REJECTED)}
              >
                Rejected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                Type: {typeFilter === 'all' ? 'All' : typeFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTypeFilter('all')}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter('dues')}>
                Dues
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter('donation')}>
                Donation
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter('pledge')}>
                Pledge
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions</CardTitle>
          <CardDescription>
            View and manage all member payment transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => {
                  const member = members.find((m) => m.id === payment.userId);
                  return (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">
                        {new Date(payment.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{member?.name || 'Unknown'}</TableCell>
                      <TableCell className="capitalize">
                        {payment.type}
                      </TableCell>
                      <TableCell>{payment.description}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={payment.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            {payment.status === PaymentStatus.PENDING && (
                              <>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleApprovePayment(payment.id)
                                  }
                                >
                                  Approve Payment
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleRejectPayment(payment.id)
                                  }
                                >
                                  Reject Payment
                                </DropdownMenuItem>
                              </>
                            )}
                            {payment.receiptUrl && (
                              <DropdownMenuItem>View Receipt</DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No payments found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DuesManagement;
