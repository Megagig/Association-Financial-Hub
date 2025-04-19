import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/Dashboard/StatusBadge';
import {
  User,
  Calendar,
  Receipt,
  Clock,
  CircleDollarSign,
  FileText,
  Download,
} from 'lucide-react';
import { PaymentStatus } from '@/types';

interface PaymentDetailsModalProps {
  payment: {
    id: string;
    userId: string;
    amount: number;
    type: string;
    description: string;
    date: string;
    status: PaymentStatus;
    approvalDate?: string;
    receiptUrl?: string;
    memberName: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentDetailsModal({
  payment,
  isOpen,
  onClose,
}: PaymentDetailsModalProps) {
  if (!payment) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Payment Details</DialogTitle>
          <DialogDescription>
            Complete information about this payment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium capitalize">
              {payment.type} Payment
            </h3>
            <StatusBadge status={payment.status} />
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-2">
              <CircleDollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">{formatCurrency(payment.amount)}</p>
                <p className="text-sm text-muted-foreground">
                  {payment.description}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">{payment.memberName}</p>
                <p className="text-sm text-muted-foreground">
                  Member ID: {payment.userId}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Submitted on</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(payment.date)}
                </p>
              </div>
            </div>

            {payment.approvalDate && (
              <div className="flex items-start gap-2">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Processed on</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(payment.approvalDate)}
                  </p>
                </div>
              </div>
            )}

            {payment.receiptUrl && (
              <div className="flex items-start gap-2">
                <Receipt className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Receipt</p>
                  <Button variant="outline" size="sm" className="mt-1">
                    <FileText className="h-4 w-4 mr-2" />
                    View Receipt
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-between">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Record
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
