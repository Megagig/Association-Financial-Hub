import { useData } from '../../context/DataContext';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { DateRangePicker } from '../../components/ui/date-range-picker';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Download,
  FileText,
  Filter,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
} from 'lucide-react';
import { format } from 'date-fns';

export default function ReportsPage() {
  const { members, payments, loans, reports, isLoading } = useData();
  const [reportType, setReportType] = useState<'financial' | 'member' | 'loan'>(
    'financial'
  );
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), 0, 1), // January 1st of current year
    to: new Date(),
  });
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');

  if (isLoading) {
    return <div className="text-center py-10">Loading reports data...</div>;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredPayments = payments.filter((payment) => {
    const paymentDate = new Date(payment.date);
    return paymentDate >= dateRange.from && paymentDate <= dateRange.to;
  });

  const paymentsByType = filteredPayments.reduce((acc, payment) => {
    acc[payment.type] = (acc[payment.type] || 0) + payment.amount;
    return acc;
  }, {} as Record<string, number>);

  const paymentChartData = Object.entries(paymentsByType).map(
    ([type, amount]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      amount,
    })
  );

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const generateReport = () => {
    if (reportType === 'member') {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Member Statistics Report</h3>
            <Button size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{members.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {members.filter((m) => m.duesOwing === 0).length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Members with Outstanding Dues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {members.filter((m) => m.duesOwing > 0).length}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Member Distribution by Graduation Year</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={Object.entries(
                    members.reduce((acc, member) => {
                      const year = member.graduationYear;
                      acc[year] = (acc[year] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  )
                    .map(([year, count]) => ({ year, count }))
                    .sort((a, b) => a.year.localeCompare(b.year))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Members" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      );
    } else if (reportType === 'loan') {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Loan Statistics Report</h3>
            <Button size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Loans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loans.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Approved Loans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loans.filter((l) => l.status === 'approved').length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Loans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loans.filter((l) => l.status === 'pending').length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Rejected Loans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loans.filter((l) => l.status === 'rejected').length}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Loan Distribution by Purpose</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'bar' ? (
                  <BarChart
                    data={Object.entries(
                      loans.reduce((acc, loan) => {
                        const purpose = loan.purpose.split(' ')[0]; // Just take first word for simplicity
                        acc[purpose] = (acc[purpose] || 0) + loan.amount;
                        return acc;
                      }, {} as Record<string, number>)
                    ).map(([purpose, amount]) => ({ purpose, amount }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="purpose" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => formatCurrency(value as number)}
                    />
                    <Legend />
                    <Bar dataKey="amount" name="Amount" fill="#82ca9d" />
                  </BarChart>
                ) : (
                  <PieChart>
                    <Pie
                      data={Object.entries(
                        loans.reduce((acc, loan) => {
                          const purpose = loan.purpose.split(' ')[0]; // Just take first word for simplicity
                          acc[purpose] = (acc[purpose] || 0) + loan.amount;
                          return acc;
                        }, {} as Record<string, number>)
                      ).map(([purpose, amount]) => ({
                        name: purpose,
                        value: amount,
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {loans
                        .reduce((acc, loan) => {
                          const purpose = loan.purpose.split(' ')[0];
                          if (!acc.includes(purpose)) acc.push(purpose);
                          return acc;
                        }, [] as string[])
                        .map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(value as number)}
                    />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      );
    } else {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Financial Report</h3>
            <Button size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Income
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(
                    filteredPayments.reduce(
                      (sum, payment) => sum + payment.amount,
                      0
                    )
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {format(dateRange.from, 'MMM d, yyyy')} -{' '}
                  {format(dateRange.to, 'MMM d, yyyy')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Dues Collected
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(
                    filteredPayments
                      .filter((payment) => payment.type === 'dues')
                      .reduce((sum, payment) => sum + payment.amount, 0)
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Donations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(
                    filteredPayments
                      .filter((payment) => payment.type === 'donation')
                      .reduce((sum, payment) => sum + payment.amount, 0)
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Income by Category</CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant={chartType === 'bar' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setChartType('bar')}
                >
                  <BarChartIcon className="h-4 w-4 mr-1" />
                  Bar
                </Button>
                <Button
                  variant={chartType === 'pie' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setChartType('pie')}
                >
                  <PieChartIcon className="h-4 w-4 mr-1" />
                  Pie
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'bar' ? (
                  <BarChart
                    data={paymentChartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => formatCurrency(value as number)}
                    />
                    <Legend />
                    <Bar dataKey="amount" name="Amount" fill="#8884d8" />
                  </BarChart>
                ) : (
                  <PieChart>
                    <Pie
                      data={paymentChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {paymentChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(value as number)}
                    />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        <p className="text-muted-foreground">
          Generate and view financial and membership reports
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
          <CardDescription>
            Select parameters to generate a custom report
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="report-type">Report Type</Label>
              <Select
                value={reportType}
                onValueChange={(value) => setReportType(value as any)}
              >
                <SelectTrigger id="report-type">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="financial">Financial Report</SelectItem>
                  <SelectItem value="member">Member Statistics</SelectItem>
                  <SelectItem value="loan">Loan Statistics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date Range</Label>
              <DateRangePicker date={dateRange} onDateChange={setDateRange} />
            </div>

            <div className="flex items-end">
              <Button className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="generated">
        <TabsList>
          <TabsTrigger value="generated">Generated Report</TabsTrigger>
          <TabsTrigger value="saved">Saved Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="generated" className="space-y-4">
          {generateReport()}
        </TabsContent>
        <TabsContent value="saved">
          <Card>
            <CardHeader>
              <CardTitle>Saved Reports</CardTitle>
              <CardDescription>
                Previously generated and saved reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reports.length > 0 ? (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{report.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {report.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(
                              new Date(report.dateRange.from),
                              'MMM d, yyyy'
                            )}{' '}
                            -
                            {format(
                              new Date(report.dateRange.to),
                              'MMM d, yyyy'
                            )}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No Saved Reports</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Generate and save reports to view them here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
