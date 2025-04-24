import { useState, useEffect } from 'react';
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
import { Loan } from '@/types';

export default function MyLoansPage() {
  const { user } = useAuth();
  const { getMemberLoans, isLoading: dataContextLoading } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const loansData = await getMemberLoans(user.id);
        // Ensure loansData is an array
        setLoans(Array.isArray(loansData) ? loansData : []);
      } catch (error) {
        console.error('Error fetching loans:', error);
        setLoans([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoans();
  }, [user, getMemberLoans]);

  if (isLoading || dataContextLoading || !user) {
    return <div className="text-center py-10">Loading loans data...</div>;
  }

  // Make absolutely sure loans is an array before filtering
  const loansArray = Array.isArray(loans) ? loans : [];

  // Filter loans based on search query
  const filteredLoans = loansArray.filter(
    (loan) =>
      loan?.purpose?.toLowerCase().includes(searchQuery.toLowerCase()) || true
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
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
        {filteredLoans.length > 0 ? (
          filteredLoans.map((loan) => (
            <Card key={loan.id || `loan-${Math.random()}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{loan.purpose || 'Unnamed Loan'}</CardTitle>
                    <CardDescription>
                      Applied on{' '}
                      {loan.applicationDate
                        ? new Date(loan.applicationDate).toLocaleDateString()
                        : 'Unknown date'}
                    </CardDescription>
                  </div>
                  <StatusBadge status={loan.status || 'pending'} />
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
          ))
        ) : (
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
