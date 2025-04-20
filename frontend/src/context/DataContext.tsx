import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import {
  User,
  Payment,
  Loan,
  Due,
  Member,
  FinancialSummary,
  Report,
  UserSettings,
  UserRole,
  PaymentStatus,
  LoanStatus,
  DueType,
} from '../types';

import { useToast } from '../components/ui/use-toast';
import { useAuth } from './AuthContext';

interface DataContextType {
  members: Member[];
  payments: Payment[];
  loans: Loan[];
  dues: Due[];
  financialSummary: FinancialSummary | null;
  reports: Report[];
  userSettings: UserSettings | null;
  isLoading: boolean;
  addPayment: (payment: Partial<Payment>) => Promise<void>;
  updatePaymentStatus: (id: string, status: PaymentStatus) => Promise<void>;
  addLoan: (loan: Loan) => Promise<void>;
  updateLoanStatus: (id: string, status: LoanStatus) => Promise<void>;
  addDue: (due: Due) => Promise<void>;
  updateDueStatus: (id: string, status: PaymentStatus) => Promise<void>;
  addReport: (report: Report) => Promise<void>;
  updateUserSettings: (settings: UserSettings) => Promise<void>;
  getMemberById: (userId: string) => Member | undefined;
  getMemberPayments: (userId: string) => Payment[];
  getMemberLoans: (userId: string) => Loan[];
  applyForLoan: (loanData: {
    userId: string;
    amount: number;
    purpose: string;
  }) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [dues, setDues] = useState<Due[]>([]);
  const [financialSummary, setFinancialSummary] =
    useState<FinancialSummary | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const mockMembers: Member[] = [
          {
            id: 'member-1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '123-456-7890',
            membershipId: 'JD123',
            graduationYear: '2010',
            memberSince: '2015-01-01',
            department: 'Engineering',
            currentWorkplace: 'ABC Corp',
            currentPosition: 'Senior Engineer',
            avatar: 'https://i.pravatar.cc/150?img=1',
            totalDuesPaid: 500,
            duesOwing: 100,
            totalDonations: 200,
            activeLoans: 1,
            loanBalance: 5000,
          },
          {
            id: 'member-2',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            phone: '987-654-3210',
            membershipId: 'JS456',
            graduationYear: '2012',
            memberSince: '2016-05-15',
            department: 'Marketing',
            currentWorkplace: 'XYZ Ltd',
            currentPosition: 'Marketing Manager',
            avatar: 'https://i.pravatar.cc/150?img=2',
            totalDuesPaid: 600,
            duesOwing: 0,
            totalDonations: 300,
            activeLoans: 0,
            loanBalance: 0,
          },
          {
            id: 'member-3',
            name: 'Alice Johnson',
            email: 'alice.johnson@example.com',
            phone: '555-123-4567',
            membershipId: 'AJ789',
            graduationYear: '2015',
            memberSince: '2018-03-10',
            department: 'Finance',
            currentWorkplace: 'PQR Inc',
            currentPosition: 'Financial Analyst',
            avatar: 'https://i.pravatar.cc/150?img=3',
            totalDuesPaid: 400,
            duesOwing: 200,
            totalDonations: 100,
            activeLoans: 1,
            loanBalance: 2500,
          },
          {
            id: 'member-4',
            name: 'Bob Williams',
            email: 'bob.williams@example.com',
            phone: '111-222-3333',
            membershipId: 'BW012',
            graduationYear: '2013',
            memberSince: '2017-09-20',
            department: 'Arts',
            currentWorkplace: 'LMN Studio',
            currentPosition: 'Creative Director',
            avatar: 'https://i.pravatar.cc/150?img=4',
            totalDuesPaid: 700,
            duesOwing: 50,
            totalDonations: 400,
            activeLoans: 0,
            loanBalance: 0,
          },
          {
            id: 'member-5',
            name: 'Emily Brown',
            email: 'emily.brown@example.com',
            phone: '444-555-6666',
            membershipId: 'EB345',
            graduationYear: '2011',
            memberSince: '2014-11-01',
            department: 'Science',
            currentWorkplace: 'STU Labs',
            currentPosition: 'Research Scientist',
            avatar: 'https://i.pravatar.cc/150?img=5',
            totalDuesPaid: 550,
            duesOwing: 75,
            totalDonations: 250,
            activeLoans: 1,
            loanBalance: 1000,
          },
        ];
        const mockPayments: Payment[] = [
          {
            id: 'payment-1',
            userId: 'member-1',
            amount: 50,
            type: 'dues',
            description: 'Membership dues payment',
            date: '2024-01-15',
            status: PaymentStatus.APPROVED,
            receiptUrl: 'https://example.com/receipt1.jpg',
          },
          {
            id: 'payment-2',
            userId: 'member-2',
            amount: 100,
            type: 'donation',
            description: 'Annual donation',
            date: '2024-02-01',
            status: PaymentStatus.PENDING,
            receiptUrl: 'https://example.com/receipt2.jpg',
          },
          {
            id: 'payment-3',
            userId: 'member-3',
            amount: 25,
            type: 'dues',
            description: 'Partial dues payment',
            date: '2024-02-10',
            status: PaymentStatus.REJECTED,
            receiptUrl: 'https://example.com/receipt3.jpg',
          },
          {
            id: 'payment-4',
            userId: 'member-1',
            amount: 75,
            type: 'pledge',
            description: 'Pledge payment for new building',
            date: '2024-03-01',
            status: PaymentStatus.APPROVED,
            receiptUrl: 'https://example.com/receipt4.jpg',
          },
          {
            id: 'payment-5',
            userId: 'member-4',
            amount: 60,
            type: 'dues',
            description: 'Membership dues',
            date: '2024-03-15',
            status: PaymentStatus.PENDING,
            receiptUrl: 'https://example.com/receipt5.jpg',
          },
        ];
        const mockLoans: Loan[] = [
          {
            id: 'loan-1',
            userId: 'member-1',
            amount: 1000,
            purpose: 'Education',
            applicationDate: '2023-11-01',
            status: LoanStatus.APPROVED,
            approvedBy: 'admin-1',
            approvalDate: '2023-11-15',
            repaymentTerms: '12 months',
            dueDate: '2024-11-15',
          },
          {
            id: 'loan-2',
            userId: 'member-3',
            amount: 500,
            purpose: 'Business',
            applicationDate: '2023-12-01',
            status: LoanStatus.PENDING,
            repaymentTerms: '6 months',
            dueDate: '2024-06-01',
          },
          {
            id: 'loan-3',
            userId: 'member-5',
            amount: 2000,
            purpose: 'Home Improvement',
            applicationDate: '2024-01-01',
            status: LoanStatus.REJECTED,
            repaymentTerms: '24 months',
            dueDate: '2026-01-01',
          },
        ];
        const mockDues: Due[] = [
          {
            id: 'due-1',
            userId: 'member-1',
            title: 'Annual Membership Dues',
            description: 'Annual dues for 2024',
            amount: 100,
            type: DueType.ANNUAL,
            createdAt: '2024-01-01',
            dueDate: '2024-12-31',
            status: PaymentStatus.PENDING,
            paidAmount: 0,
            issuedBy: 'admin-1',
          },
          {
            id: 'due-2',
            userId: 'member-2',
            title: 'Monthly Dues - January',
            description: 'Dues for January 2024',
            amount: 25,
            type: DueType.MONTHLY,
            createdAt: '2024-01-01',
            dueDate: '2024-01-31',
            status: PaymentStatus.APPROVED,
            paidAmount: 25,
            issuedBy: 'admin-1',
          },
          {
            id: 'due-3',
            userId: 'member-3',
            title: 'Special Event Dues',
            description: 'Dues for Alumni Reunion Event',
            amount: 50,
            type: DueType.SPECIAL,
            createdAt: '2024-02-15',
            dueDate: '2024-03-15',
            status: PaymentStatus.PENDING,
            paidAmount: 0,
            issuedBy: 'admin-1',
          },
        ];
        const mockFinancialSummary: FinancialSummary = {
          totalMembers: mockMembers.length,
          totalDuesCollected: 15000,
          totalDuesPending: 5000,
          totalDonations: 10000,
          totalPledges: 2500,
          totalLoansDisbursed: 20000,
          totalLoansRepaid: 5000,
          pendingLoanApplications: 5,
        };
        const mockReports: Report[] = [
          {
            id: 'report-1',
            title: 'Monthly Financial Report',
            description: 'Summary of financial activities for January 2024',
            dateRange: {
              from: '2024-01-01',
              to: '2024-01-31',
            },
            type: 'summary',
            generatedBy: 'admin-1',
            generatedAt: '2024-02-01',
            data: {
              income: 10000,
              expenses: 5000,
            },
          },
        ];
        const mockUserSettings: UserSettings = {
          id: 'settings-1',
          userId: user?.id || 'user-1',
          emailNotifications: true,
          paymentReminders: true,
          dueReminders: true,
          theme: 'light',
          language: 'en',
        };

        setMembers(mockMembers);
        setPayments(mockPayments);
        setLoans(mockLoans);
        setDues(mockDues);
        setFinancialSummary(mockFinancialSummary);
        setReports(mockReports);
        setUserSettings(mockUserSettings);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load data. Please try again later.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, toast]);

  const addPayment = async (paymentData: Partial<Payment>) => {
    const newPayment: Payment = {
      id: `payment-${Date.now()}`,
      userId: paymentData.userId || '',
      amount: paymentData.amount || 0,
      type: paymentData.type || 'dues',
      description: paymentData.description || '',
      date: paymentData.date || new Date().toISOString(),
      status: PaymentStatus.PENDING,
      receiptUrl: paymentData.receiptUrl || '',
    };

    setPayments((prevPayments) => [newPayment, ...prevPayments]);

    await new Promise((resolve) => setTimeout(resolve, 500));

    toast({
      title: 'Payment Added',
      description: 'Payment added successfully.',
    });
  };

  const updatePaymentStatus = async (id: string, status: PaymentStatus) => {
    setPayments((prevPayments) =>
      prevPayments.map((payment) =>
        payment.id === id ? { ...payment, status } : payment
      )
    );

    await new Promise((resolve) => setTimeout(resolve, 500));

    toast({
      title: 'Payment Updated',
      description: `Payment status updated to ${status}.`,
    });
  };

  const addLoan = async (loan: Loan) => {
    setLoans((prevLoans) => [loan, ...prevLoans]);

    await new Promise((resolve) => setTimeout(resolve, 500));

    toast({
      title: 'Loan Added',
      description: 'Loan added successfully.',
    });
  };

  const updateLoanStatus = async (id: string, status: LoanStatus) => {
    setLoans((prevLoans) =>
      prevLoans.map((loan) => (loan.id === id ? { ...loan, status } : loan))
    );

    await new Promise((resolve) => setTimeout(resolve, 500));

    toast({
      title: 'Loan Updated',
      description: `Loan status updated to ${status}.`,
    });
  };

  const addDue = async (due: Due) => {
    setDues((prevDues) => [due, ...prevDues]);

    await new Promise((resolve) => setTimeout(resolve, 500));

    toast({
      title: 'Due Added',
      description: 'Due added successfully.',
    });
  };

  const updateDueStatus = async (id: string, status: PaymentStatus) => {
    setDues((prevDues) =>
      prevDues.map((due) => (due.id === id ? { ...due, status } : due))
    );

    await new Promise((resolve) => setTimeout(resolve, 500));

    toast({
      title: 'Due Updated',
      description: `Due status updated to ${status}.`,
    });
  };

  const addReport = async (report: Report) => {
    setReports((prevReports) => [report, ...prevReports]);

    await new Promise((resolve) => setTimeout(resolve, 500));

    toast({
      title: 'Report Added',
      description: 'Report added successfully.',
    });
  };

  const updateUserSettings = async (settings: UserSettings) => {
    setUserSettings(settings);

    await new Promise((resolve) => setTimeout(resolve, 500));

    toast({
      title: 'Settings Updated',
      description: 'User settings updated successfully.',
    });
  };

  const getMemberById = (userId: string): Member | undefined => {
    return members.find((member) => member.id === userId);
  };

  const getMemberPayments = (userId: string): Payment[] => {
    return payments.filter((payment) => payment.userId === userId);
  };

  const getMemberLoans = (userId: string): Loan[] => {
    return loans.filter((loan) => loan.userId === userId);
  };

  const applyForLoan = async (loanData: {
    userId: string;
    amount: number;
    purpose: string;
  }) => {
    const newLoan: Loan = {
      id: `loan-${Date.now()}`,
      userId: loanData.userId,
      amount: loanData.amount,
      purpose: loanData.purpose,
      applicationDate: new Date().toISOString(),
      status: LoanStatus.PENDING,
      repaymentTerms: '12 months',
      dueDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    };

    setLoans((prevLoans) => [newLoan, ...prevLoans]);

    await new Promise((resolve) => setTimeout(resolve, 500));

    toast({
      title: 'Loan Application Submitted',
      description: 'Your loan application has been submitted for review.',
    });
  };

  const value: DataContextType = {
    members,
    payments,
    loans,
    dues,
    financialSummary,
    reports,
    userSettings,
    isLoading,
    addPayment,
    updatePaymentStatus,
    addLoan,
    updateLoanStatus,
    addDue,
    updateDueStatus,
    addReport,
    updateUserSettings,
    getMemberById,
    getMemberPayments,
    getMemberLoans,
    applyForLoan,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// // Add these functions to your DataContext
// const getMemberProfile = (userId: string) => {
//   // Implement your logic to fetch member profile
//   return user;
// };

// const getAdminProfile = (userId: string) => {
//   // Implement your logic to fetch admin profile
//   return user;
// };

// const updateMemberProfile = async (userId: string, data: any) => {
//   // Implement your profile update logic
// };

// const updateAdminProfile = async (userId: string, data: any) => {
//   // Implement your profile update logic
// };
