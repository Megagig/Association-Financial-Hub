import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/Dashboard/StatusBadge';
import { Search, Plus } from 'lucide-react';

export default function MyLoansPage() {
  const { user } = useAuth();
  const { getMemberLoans, isLoading } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  if (isLoading || !user) {
    return <div className="text-center py-10">Loading loans data...</div>;
  }

  const loans = getMemberLoans(user.id);

  // Filter loans based on search query
  const filteredLoans = loans.filter((loan) =>
    loan.purpose.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Loans</h2>
          <p className="text-muted-foreground">View and manage your loans</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Apply for Loan
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search loans..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-[300px] pl-8"
        />
      </div>

      <div className="grid gap-4">
        {filteredLoans.map((loan) => (
          <Card key={loan.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{loan.purpose}</CardTitle>
                  <CardDescription>
                    Applied on{' '}
                    {new Date(loan.applicationDate).toLocaleDateString()}
                  </CardDescription>
                </div>
                <StatusBadge status={loan.status} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium">{formatCurrency(loan.amount)}</p>
                </div>
                {loan.approvalDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {loan.status === 'approved'
                        ? 'Approved Date'
                        : 'Reviewed Date'}
                    </p>
                    <p className="font-medium">
                      {new Date(loan.approvalDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {loan.dueDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Due Date</p>
                    <p className="font-medium">
                      {new Date(loan.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredLoans.length === 0 && (
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-muted-foreground">No loans found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
