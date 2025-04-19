import { cn } from '@/lib/utils';
import { PaymentStatus, LoanStatus } from '@/types';

interface StatusBadgeProps {
  status: PaymentStatus | LoanStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  let badgeClass = '';

  switch (status) {
    case PaymentStatus.PENDING:
    case LoanStatus.PENDING:
      badgeClass = 'bg-amber-100 text-amber-700 border-amber-200';
      break;
    case PaymentStatus.APPROVED:
    case LoanStatus.APPROVED:
      badgeClass = 'bg-green-100 text-green-700 border-green-200';
      break;
    case PaymentStatus.REJECTED:
    case LoanStatus.REJECTED:
      badgeClass = 'bg-red-100 text-red-700 border-red-200';
      break;
    case LoanStatus.PAID:
      badgeClass = 'bg-blue-100 text-blue-700 border-blue-200';
      break;
    default:
      badgeClass = 'bg-gray-100 text-gray-700 border-gray-200';
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border',
        badgeClass,
        className
      )}
    >
      {status}
    </span>
  );
}
