import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { StatusBadge } from '@/components/Dashboard/StatusBadge';
import {
  CircleDollarSign,
  Receipt,
  BanknoteIcon,
  AlertCircle,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import { Loan, Member, Payment } from '@/types';

export default function MemberDashboard() {
  const { user } = useAuth();
  const { getMemberById, getMemberPayments, getMemberLoans, isLoading } =
    useData();
  const [memberData, setMemberData] = useState<Member | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      const [member, memberPayments, memberLoans] = await Promise.all([
        getMemberById(user.id),
        getMemberPayments(user.id),
        getMemberLoans(user.id),
      ]);
      setMemberData(member || null);
      setPayments(memberPayments || []);
      setLoans(memberLoans || []);
    };
    fetchData();
  }, [user?.id, getMemberById, getMemberPayments, getMemberLoans]);

  const member = memberData;
  // Use state values instead of direct API calls
  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Add null check for member
  if (!member) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-muted-foreground">Member data not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Member Dashboard</h2>
        <p className="text-muted-foreground">Welcome back, {member?.name}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Dues Paid
            </CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(member?.totalDuesPaid || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dues Owing</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {formatCurrency(member?.duesOwing || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <BanknoteIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{member?.activeLoans || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Donations
            </CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(member?.totalDonations || 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>Your latest payment activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between space-x-4"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {payment.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(payment.date), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {formatCurrency(payment.amount)}
                      </p>
                    </div>
                    <StatusBadge status={payment.status} />
                  </div>
                </div>
              ))}
              {recentPayments.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No recent payments
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loan Status</CardTitle>
            <CardDescription>
              Your loan applications and active loans
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loans.map((loan) => (
                <div
                  key={loan.id}
                  className="flex items-center justify-between space-x-4"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {loan.purpose}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Applied{' '}
                      {formatDistanceToNow(new Date(loan.applicationDate), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {formatCurrency(loan.amount)}
                      </p>
                    </div>
                    <StatusBadge status={loan.status} />
                  </div>
                </div>
              ))}
              {loans.length === 0 && (
                <p className="text-sm text-muted-foreground">No loans found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
