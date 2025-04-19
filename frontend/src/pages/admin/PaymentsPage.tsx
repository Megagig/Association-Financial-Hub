import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Eye, FileText, MoreVertical, Download, Check, X } from 'lucide-react';
import { PaymentDetailsModal } from '@/components/Payments/PaymentDetailsModal';
import { ReceiptViewerModal } from '@/components/Payments/ReceiptViewerModal';

export default function PaymentsPage() {
  const { members, payments, isLoading } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  // States for modals
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  if (isLoading) {
    return <div className="text-center py-10">Loading payments data...</div>;
  }

  // Filter payments based on search query
  const filteredPayments = payments.filter((payment) => {
    const member = members.find((m) => m.id === payment.userId);
    const memberName = member?.name.toLowerCase() || '';
    const paymentType = payment.type.toLowerCase();
    const query = searchQuery.toLowerCase();

    return memberName.includes(query) || paymentType.includes(query);
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Handle view details
  const handleViewDetails = (paymentId: string) => {
    const payment = payments.find((p) => p.id === paymentId);
    const member = members.find((m) => m.id === payment?.userId);

    if (payment && member) {
      setSelectedPayment({
        ...payment,
        memberName: member.name,
      });
      setIsDetailsModalOpen(true);
    }
  };

  // Handle view receipt
  const handleViewReceipt = (paymentId: string) => {
    const payment = payments.find((p) => p.id === paymentId);

    if (payment) {
      setSelectedPayment(payment);
      setIsReceiptModalOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Payments</h2>
        <p className="text-muted-foreground">
          Manage and view all member payment records
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search by member or payment type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[300px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Records</CardTitle>
          <CardDescription>
            Review and manage all payment transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 text-muted-foreground text-sm">
                  <th className="p-3 text-left font-medium">Member</th>
                  <th className="p-3 text-left font-medium">Date</th>
                  <th className="p-3 text-left font-medium">Type</th>
                  <th className="p-3 text-left font-medium">Description</th>
                  <th className="p-3 text-right font-medium">Amount</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-right font-medium w-[80px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredPayments.map((payment) => {
                  const member = members.find((m) => m.id === payment.userId);
                  return (
                    <tr key={payment.id} className="hover:bg-muted/50">
                      <td className="p-3">{member?.name || 'Unknown'}</td>
                      <td className="p-3">
                        {new Date(payment.date).toLocaleDateString()}
                      </td>
                      <td className="p-3 capitalize">{payment.type}</td>
                      <td className="p-3">{payment.description}</td>
                      <td className="p-3 text-right">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="p-3">
                        <StatusBadge status={payment.status} />
                      </td>
                      <td className="p-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleViewDetails(payment.id)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {payment.receiptUrl && (
                              <DropdownMenuItem
                                onClick={() => handleViewReceipt(payment.id)}
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                View Receipt
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <Check className="h-4 w-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <X className="h-4 w-4 mr-2" />
                              Reject
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
                {filteredPayments.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-4 text-center text-muted-foreground"
                    >
                      No payments found. Try adjusting your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Details Modal */}
      <PaymentDetailsModal
        payment={selectedPayment}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />

      {/* Receipt Viewer Modal */}
      <ReceiptViewerModal
        payment={selectedPayment}
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
      />
    </div>
  );
}
