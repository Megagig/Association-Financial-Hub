import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
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
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { useToast } from '../../components/ui/use-toast';
import { BarChart, LineChart, PieChart, Plus, Calendar } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Checkbox } from '../../components/ui/checkbox';

export function AdminReportManager() {
  const { toast } = useToast();
  const [isGenerateReportOpen, setIsGenerateReportOpen] = useState(false);
  const [selectedReportType, setSelectedReportType] =
    useState<string>('summary');
  const [dateRange, setDateRange] = useState({
    from: '',
    to: '',
  });
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = () => {
    setIsGenerating(true);

    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerateReportOpen(false);

      toast({
        title: 'Report Generated',
        description: 'Your report has been generated successfully.',
      });
    }, 2000);
  };

  // Mock member data for selection
  const mockMembersList = [
    { id: 'member-1', name: 'John Doe' },
    { id: 'member-2', name: 'Jane Smith' },
    { id: 'member-3', name: 'Michael Johnson' },
    { id: 'member-4', name: 'Sarah Williams' },
    { id: 'member-5', name: 'Robert Brown' },
  ];

  const toggleMemberSelection = (memberId: string) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  const selectAllMembers = () => {
    if (selectedMembers.length === mockMembersList.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(mockMembersList.map((member) => member.id));
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="generate">Generate Reports</TabsTrigger>
          <TabsTrigger value="schedule">Scheduled Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => {
                setSelectedReportType('summary');
                setIsGenerateReportOpen(true);
              }}
            >
              <CardHeader className="pb-2">
                <BarChart className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Financial Summary</CardTitle>
                <CardDescription>
                  Generate a comprehensive financial overview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Generate
                </Button>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => {
                setSelectedReportType('dues');
                setIsGenerateReportOpen(true);
              }}
            >
              <CardHeader className="pb-2">
                <PieChart className="h-8 w-8 text-blue-bright mb-2" />
                <CardTitle>Dues Collection</CardTitle>
                <CardDescription>
                  Analyze dues payment status and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Generate
                </Button>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => {
                setSelectedReportType('loans');
                setIsGenerateReportOpen(true);
              }}
            >
              <CardHeader className="pb-2">
                <LineChart className="h-8 w-8 text-warning mb-2" />
                <CardTitle>Loan Analysis</CardTitle>
                <CardDescription>
                  Review loan disbursements and repayments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Generate
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Custom Report</CardTitle>
              <CardDescription>
                Create a specialized report with custom parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select defaultValue="summary">
                    <SelectTrigger id="report-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summary">Financial Summary</SelectItem>
                      <SelectItem value="dues">Dues Collection</SelectItem>
                      <SelectItem value="loans">Loan Analysis</SelectItem>
                      <SelectItem value="donations">Donation Trends</SelectItem>
                      <SelectItem value="members">Member Activity</SelectItem>
                      <SelectItem value="income-expense">
                        Income & Expenses
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-from">Date Range (From)</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="date-from" type="date" className="pl-10" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-to">Date Range (To)</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="date-to" type="date" className="pl-10" />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Custom Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>
                Automatically generate and distribute reports on a schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-medium">Monthly Financial Summary</h3>
                      <p className="text-sm text-muted-foreground">
                        Generates on the 1st of every month
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-medium">
                        Quarterly Dues Collection Report
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Generates on the 1st day of each quarter
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>

                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Scheduled Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Generate Report Dialog */}
      <Dialog
        open={isGenerateReportOpen}
        onOpenChange={setIsGenerateReportOpen}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Generate{' '}
              {selectedReportType === 'summary'
                ? 'Financial Summary'
                : selectedReportType === 'dues'
                ? 'Dues Collection'
                : selectedReportType === 'income-expense'
                ? 'Income & Expenses'
                : 'Loan Analysis'}{' '}
              Report
            </DialogTitle>
            <DialogDescription>
              Customize your report parameters
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="report-title">Report Title</Label>
                <Input
                  id="report-title"
                  placeholder="Enter a title for your report"
                  defaultValue={
                    selectedReportType === 'summary'
                      ? 'Financial Summary Report'
                      : selectedReportType === 'dues'
                      ? 'Dues Collection Report'
                      : selectedReportType === 'income-expense'
                      ? 'Income & Expenses Report'
                      : 'Loan Analysis Report'
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="report-description">
                  Description (Optional)
                </Label>
                <Input
                  id="report-description"
                  placeholder="Enter a brief description"
                  defaultValue={
                    selectedReportType === 'summary'
                      ? 'Complete financial overview'
                      : selectedReportType === 'dues'
                      ? 'Analysis of dues collection status'
                      : selectedReportType === 'income-expense'
                      ? 'Breakdown of income and expenses'
                      : 'Overview of loan disbursements and repayments'
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date-from">Date Range (From)</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="date-from"
                    type="date"
                    className="pl-10"
                    value={dateRange.from}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, from: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-to">Date Range (To)</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="date-to"
                    type="date"
                    className="pl-10"
                    value={dateRange.to}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, to: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Include Members</Label>
                <Button variant="ghost" size="sm" onClick={selectAllMembers}>
                  {selectedMembers.length === mockMembersList.length
                    ? 'Deselect All'
                    : 'Select All'}
                </Button>
              </div>
              <div className="border rounded-md p-4 max-h-40 overflow-y-auto">
                {mockMembersList.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <Checkbox
                      id={member.id}
                      checked={selectedMembers.includes(member.id)}
                      onCheckedChange={() => toggleMemberSelection(member.id)}
                    />
                    <label
                      htmlFor={member.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {member.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Report Format</Label>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="format-pdf" defaultChecked />
                  <label
                    htmlFor="format-pdf"
                    className="text-sm font-medium leading-none"
                  >
                    PDF
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="format-excel" />
                  <label
                    htmlFor="format-excel"
                    className="text-sm font-medium leading-none"
                  >
                    Excel
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="format-csv" />
                  <label
                    htmlFor="format-csv"
                    className="text-sm font-medium leading-none"
                  >
                    CSV
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Report Options</Label>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-charts" defaultChecked />
                  <label
                    htmlFor="include-charts"
                    className="text-sm font-medium leading-none"
                  >
                    Include Charts
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-tables" defaultChecked />
                  <label
                    htmlFor="include-tables"
                    className="text-sm font-medium leading-none"
                  >
                    Include Tables
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-summary" defaultChecked />
                  <label
                    htmlFor="include-summary"
                    className="text-sm font-medium leading-none"
                  >
                    Include Executive Summary
                  </label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsGenerateReportOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleGenerateReport} disabled={isGenerating}>
              {isGenerating ? 'Generating...' : 'Generate Report'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
