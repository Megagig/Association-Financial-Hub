import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Download, Printer, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

interface ReceiptViewerModalProps {
  payment: {
    id: string;
    description: string;
    receiptUrl?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReceiptViewerModal({
  payment,
  isOpen,
  onClose,
}: ReceiptViewerModalProps) {
  if (!payment) return null;

  // Mock receipt URL - in a real app, this would be the actual receipt URL
  const receiptUrl =
    payment.receiptUrl || 'https://via.placeholder.com/800x1000';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Payment Receipt</DialogTitle>
          <DialogDescription>
            Receipt for {payment.description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end space-x-2 mb-4">
          <Button variant="outline" size="sm">
            <ZoomIn className="h-4 w-4 mr-2" />
            Zoom In
          </Button>
          <Button variant="outline" size="sm">
            <ZoomOut className="h-4 w-4 mr-2" />
            Zoom Out
          </Button>
          <Button variant="outline" size="sm">
            <RotateCw className="h-4 w-4 mr-2" />
            Rotate
          </Button>
        </div>

        <div className="border rounded-md p-1 bg-gray-50 dark:bg-gray-900 h-[60vh] overflow-auto flex items-center justify-center">
          <img
            src={receiptUrl}
            alt="Payment Receipt"
            className="max-w-full max-h-full object-contain"
          />
        </div>

        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
