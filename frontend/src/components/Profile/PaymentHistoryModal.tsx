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
import { Download, Search, Filter, Calendar } from 'lucide-react';
import { PaymentStatus } from '../../types';

interface PaymentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentHistoryModal({
  isOpen,
  onClose,
}: PaymentHistoryModalProps) {
  const { user } = useAuth();
  const { getMemberPayments } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  if (!user) return null;
  const payments = getMemberPayments(user.id);

  // Filter payments based on search term
  const filteredPayments = payments.filter(
    (payment) =>
      payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.type.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Payment History</DialogTitle>
          <DialogDescription>
            Complete record of your payments and transactions
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search payments..."
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

        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-muted">
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">Description</th>
                <th className="text-right p-3">Amount</th>
                <th className="text-right p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-muted/50">
                  <td className="p-3">{formatDate(payment.date)}</td>
                  <td className="p-3 capitalize">{payment.type}</td>
                  <td className="p-3">{payment.description}</td>
                  <td className="p-3 text-right">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="p-3 text-right">
                    <StatusBadge status={payment.status} />
                  </td>
                </tr>
              ))}
              {filteredPayments.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-4 text-center text-muted-foreground"
                  >
                    {searchTerm
                      ? 'No matching payments found'
                      : 'No payment history found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
