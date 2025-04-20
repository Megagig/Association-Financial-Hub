import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { StatusBadge } from '../../components/Dashboard/StatusBadge';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import {
  Download,
  Search,
  Filter,
  Calendar,
  CircleCheck,
  Clock,
  CircleDollarSign,
} from 'lucide-react';
import { LoanStatus } from '../../types';

interface LoanHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoanHistoryModal({ isOpen, onClose }: LoanHistoryModalProps) {
  const { user } = useAuth();
  const { getMemberLoans } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  if (!user) return null;
  const loans = getMemberLoans(user.id);

  // Filter loans based on search term
  const filteredLoans = loans.filter((loan) =>
    loan.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusIcon = (status: LoanStatus) => {
    switch (status) {
      case LoanStatus.APPROVED:
        return <CircleCheck className="h-4 w-4 text-success" />;
      case LoanStatus.PENDING:
        return <Clock className="h-4 w-4 text-warning" />;
      case LoanStatus.REJECTED:
        return <CircleDollarSign className="h-4 w-4 text-error" />;
      case LoanStatus.PAID:
        return <CircleDollarSign className="h-4 w-4 text-success" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Loan History</DialogTitle>
          <DialogDescription>
            Complete record of your loan applications and repayments
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search loans..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
        </div>

        <div className="space-y-4">
          {filteredLoans.map((loan) => (
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
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="font-medium">{formatCurrency(loan.amount)}</p>
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
                    <p className="text-xs text-muted-foreground">Due Date</p>
                    <p className="font-medium">{formatDate(loan.dueDate)}</p>
                  </div>
                )}
              </div>

              <div className="mt-2 pt-2 border-t">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          ))}
          {filteredLoans.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm
                  ? 'No matching loans found'
                  : 'No loan history found'}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export History
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
