import { useData } from '@/context/DataContext';
import { StatCard } from '@/components/Dashboard/StatCard';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { StatusBadge } from '@/components/Dashboard/StatusBadge';
import DuesManagement from '@/components/Dashboard/DuesManagement';
import {
  Users,
  CreditCard,
  CircleDollarSign,
  BanknoteIcon,
  TrendingUp,
  GiftIcon,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function AdminDashboard() {
  const { financialSummary, members, payments, loans, isLoading } = useData();

  if (isLoading) {
    return <div className="text-center py-10">Loading dashboard data...</div>;
  }

  // Get recent payments
  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Get recent loan applications
  const recentLoans = [...loans]
    .sort(
      (a, b) =>
        new Date(b.applicationDate).getTime() -
        new Date(a.applicationDate).getTime()
    )
    .slice(0, 5);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of all alumni financial activities and statistics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Members"
          value={financialSummary.totalMembers}
          icon={Users}
          iconColor="text-blue-bright"
        />
        <StatCard
          title="Dues Collected"
          value={formatCurrency(financialSummary.totalDuesCollected)}
          icon={CreditCard}
          iconColor="text-success"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Total Donations"
          value={formatCurrency(financialSummary.totalDonations)}
          icon={GiftIcon}
          iconColor="text-blue-royal"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Loans Disbursed"
          value={formatCurrency(financialSummary.totalLoansDisbursed)}
          icon={CircleDollarSign}
          iconColor="text-warning"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>Latest member payment activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayments.map((payment) => {
                const member = members.find((m) => m.id === payment.userId);
                return (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between space-x-4"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {member?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {payment.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {formatCurrency(payment.amount)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(payment.date), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      <StatusBadge status={payment.status} />
                    </div>
                  </div>
                );
              })}
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
            <CardTitle>Loan Applications</CardTitle>
            <CardDescription>Most recent loan requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLoans.map((loan) => {
                const member = members.find((m) => m.id === loan.userId);
                return (
                  <div
                    key={loan.id}
                    className="flex items-center justify-between space-x-4"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {member?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {loan.purpose}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {formatCurrency(loan.amount)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(loan.applicationDate), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      <StatusBadge status={loan.status} />
                    </div>
                  </div>
                );
              })}
              {recentLoans.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No recent loan applications
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <DuesManagement />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Dues Pending"
          value={formatCurrency(financialSummary.totalDuesPending)}
          icon={TrendingUp}
          iconColor="text-warning"
        />
        <StatCard
          title="Total Pledges"
          value={formatCurrency(financialSummary.totalPledges)}
          icon={BanknoteIcon}
          iconColor="text-blue-medium"
        />
        <StatCard
          title="Loans Repaid"
          value={formatCurrency(financialSummary.totalLoansRepaid)}
          icon={CreditCard}
          iconColor="text-success"
        />
        <StatCard
          title="Pending Loan Applications"
          value={financialSummary.pendingLoanApplications}
          icon={CircleDollarSign}
          iconColor="text-error"
        />
      </div>
    </div>
  );
}
