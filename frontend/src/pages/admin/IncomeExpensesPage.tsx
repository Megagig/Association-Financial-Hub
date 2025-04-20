import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserRole } from '@/types';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  ArrowUpFromLine,
  ArrowDownToLine,
  Plus,
  Search,
  Filter,
  Download,
  CalendarIcon,
} from 'lucide-react';

// Define the types for income and expenses
interface FinancialTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  createdBy: string;
  createdAt: string;
  notes?: string;
  receipt?: string;
}

export default function IncomeExpensesPage() {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAddingIncome, setIsAddingIncome] = useState(true);
  const [transactionDate, setTransactionDate] = useState<Date | undefined>(
    new Date()
  );
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('dues');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data for income and expenses
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([
    {
      id: 'tx-1',
      date: '2025-03-15',
      description: 'Annual Membership Dues',
      amount: 15000,
      category: 'dues',
      createdBy: 'Admin User',
      createdAt: '2025-03-15T10:30:00Z',
    },
    {
      id: 'tx-2',
      date: '2025-03-10',
      description: 'Donation from ABC Corporation',
      amount: 5000,
      category: 'donation',
      createdBy: 'Admin User',
      createdAt: '2025-03-10T14:15:00Z',
      notes: 'Corporate sponsorship for alumni event',
    },
    {
      id: 'tx-3',
      date: '2025-03-05',
      description: 'Annual Gala Expenses',
      amount: -8500,
      category: 'event',
      createdBy: 'Admin User',
      createdAt: '2025-03-05T09:45:00Z',
    },
    {
      id: 'tx-4',
      date: '2025-02-28',
      description: 'Office Supplies',
      amount: -1200,
      category: 'administrative',
      createdBy: 'Admin User',
      createdAt: '2025-02-28T11:20:00Z',
    },
    {
      id: 'tx-5',
      date: '2025-02-20',
      description: 'Scholarship Fund Donation',
      amount: 10000,
      category: 'donation',
      createdBy: 'Admin User',
      createdAt: '2025-02-20T15:30:00Z',
    },
    {
      id: 'tx-6',
      date: '2025-02-15',
      description: 'Website Maintenance',
      amount: -3500,
      category: 'administrative',
      createdBy: 'Admin User',
      createdAt: '2025-02-15T13:10:00Z',
    },
  ]);

  // Update the access check to include superadmin
  if (!user?.role || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>
              You don't have permission to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>This page is only available to administrators.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filter transactions based on active tab, search query, and filters
  const filteredTransactions = transactions.filter((transaction) => {
    // Filter by tab selection (income/expense/all)
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'income' && transaction.amount > 0) ||
      (activeTab === 'expense' && transaction.amount < 0);

    // Filter by search query
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by category
    const matchesCategory =
      categoryFilter === 'all' || transaction.category === categoryFilter;

    // Filter by date
    const matchesDate =
      !dateFilter ||
      new Date(transaction.date).toDateString() === dateFilter.toDateString();

    return matchesTab && matchesSearch && matchesCategory && matchesDate;
  });

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const netBalance = totalIncome - totalExpenses;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!amount || !description || !category || !transactionDate) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
      });
      setIsSubmitting(false);
      return;
    }

    // Create new transaction
    const newTransaction: FinancialTransaction = {
      id: `tx-${Date.now()}`,
      date: transactionDate.toISOString().split('T')[0],
      description,
      amount: isAddingIncome ? Number(amount) : -Number(amount),
      category,
      createdBy: user?.name || 'Admin User',
      createdAt: new Date().toISOString(),
      notes: notes || undefined,
    };

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Add to transactions
    setTransactions([newTransaction, ...transactions]);

    // Show success message
    toast({
      title: 'Transaction added',
      description: `Successfully added new ${
        isAddingIncome ? 'income' : 'expense'
      } transaction.`,
    });

    // Reset form and close dialog
    setDescription('');
    setAmount('');
    setCategory(isAddingIncome ? 'dues' : 'administrative');
    setNotes('');
    setIsSubmitting(false);
    setIsAddDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Income & Expenses</h2>
        <p className="text-muted-foreground">
          Manage and track the association's financial transactions
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowUpFromLine className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {formatCurrency(totalIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              {transactions.filter((t) => t.amount > 0).length} transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <ArrowDownToLine className="h-4 w-4 text-error" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-error">
              {formatCurrency(totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              {transactions.filter((t) => t.amount < 0).length} transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                'text-2xl font-bold',
                netBalance >= 0 ? 'text-success' : 'text-error'
              )}
            >
              {formatCurrency(netBalance)}
            </div>
            <p className="text-xs text-muted-foreground">
              Current financial status
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full md:w-auto"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expense">Expenses</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <div className="relative flex-1 w-full md:w-auto md:max-w-[250px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transactions..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-row gap-2 w-full md:w-auto">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="dues">Dues</SelectItem>
                <SelectItem value="donation">Donations</SelectItem>
                <SelectItem value="event">Events</SelectItem>
                <SelectItem value="administrative">Administrative</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full md:w-auto justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFilter ? format(dateFilter, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateFilter}
                  onSelect={setDateFilter}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {dateFilter && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDateFilter(undefined)}
              >
                ×
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Transaction History</h3>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={() => {
              setIsAddingIncome(true);
              setCategory('dues');
              setIsAddDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Income
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setIsAddingIncome(false);
              setCategory('administrative');
              setIsAddDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {new Date(transaction.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell className="capitalize">
                      {transaction.category}
                    </TableCell>
                    <TableCell
                      className={cn(
                        'text-right font-medium',
                        transaction.amount > 0 ? 'text-success' : 'text-error'
                      )}
                    >
                      {transaction.amount > 0 ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No transactions found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Transaction Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Add {isAddingIncome ? 'Income' : 'Expense'} Transaction
            </DialogTitle>
            <DialogDescription>
              Enter the details for the new{' '}
              {isAddingIncome ? 'income' : 'expense'} transaction.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {transactionDate
                      ? format(transactionDate, 'PPP')
                      : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={transactionDate}
                    onSelect={setTransactionDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter transaction description"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  $
                </span>
                <Input
                  id="amount"
                  value={amount}
                  onChange={(e) => {
                    // Only allow numbers and decimals
                    const value = e.target.value.replace(/[^0-9.]/g, '');
                    setAmount(value);
                  }}
                  placeholder="0.00"
                  className="pl-8"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {isAddingIncome ? (
                    <>
                      <SelectItem value="dues">Dues</SelectItem>
                      <SelectItem value="donation">Donation</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="investment">Investment</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="administrative">
                        Administrative
                      </SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="scholarship">Scholarship</SelectItem>
                      <SelectItem value="utility">Utility</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes..."
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Add Transaction'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
