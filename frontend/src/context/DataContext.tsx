import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import {
  // User,
  Payment,
  Loan,
  Due,
  Member,
  FinancialSummary,
  Report,
  // UserRole,
  // DueType,
  UserSettings,
  PaymentStatus,
  LoanStatus,
} from '../types';

import { useToast } from '../components/ui/use-toast';
import { useAuth } from './AuthContext';

import {
  membersAPI,
  paymentsAPI,
  loansAPI,
  duesAPI,
  reportsAPI,
  userAPI,
} from '../services/api';

import {
  CreatePaymentRequest,
  LoanApplicationRequest,
  CreateDueRequest,
  GenerateReportRequest,
  UpdateUserSettingsRequest,
} from '../services/api.types';
import { handleApiError } from '../lib/errorHandling';

interface DataContextType {
  members: Member[];
  payments: Payment[];
  loans: Loan[];
  dues: Due[];
  financialSummary: FinancialSummary | null;
  reports: Report[];
  userSettings: UserSettings | null;
  isLoading: boolean;
  addPayment: (payment: CreatePaymentRequest) => Promise<void>;
  updatePaymentStatus: (id: string, status: PaymentStatus) => Promise<void>;
  addLoan: (loan: LoanApplicationRequest) => Promise<void>;
  updateLoanStatus: (id: string, status: LoanStatus) => Promise<void>;
  addDue: (due: CreateDueRequest) => Promise<void>;
  updateDueStatus: (id: string, status: PaymentStatus) => Promise<void>;
  addReport: (report: GenerateReportRequest) => Promise<void>;
  updateUserSettings: (settings: UpdateUserSettingsRequest) => Promise<void>;
  getMemberById: (userId: string) => Member | undefined;
  getMemberPayments: (userId: string) => Promise<Payment[]>;
  getMemberLoans: (userId: string) => Promise<Loan[]>;
  applyForLoan: (loanData: {
    userId: string;
    amount: number;
    purpose: string;
  }) => Promise<void>;
  refreshData: () => Promise<void>;
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

  const refreshData = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      // Fetch all data in parallel for better performance
      const [
        membersData,
        paymentsData,
        loansData,
        duesData,
        financialSummaryData,
        reportsData,
        userSettingsData,
      ] = await Promise.all([
        membersAPI.getAllMembers(),
        paymentsAPI.getAllPayments(),
        loansAPI.getAllLoans(),
        duesAPI.getAllDues(),
        membersAPI.getFinancialSummary(),
        reportsAPI.getAllReports(),
        userAPI.getUserSettings(user.id),
      ]);

      setMembers(membersData);
      setPayments(paymentsData);
      setLoans(loansData);
      setDues(duesData);
      setFinancialSummary(financialSummaryData);
      setReports(reportsData);
      setUserSettings(userSettingsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: handleApiError(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [user]);

  const addPayment = async (paymentData: CreatePaymentRequest) => {
    try {
      const newPayment = await paymentsAPI.createPayment(paymentData);

      setPayments((prevPayments) => [newPayment, ...prevPayments]);

      toast({
        title: 'Payment Added',
        description: 'Payment added successfully.',
      });
    } catch (error) {
      console.error('Error adding payment:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: handleApiError(error),
      });
    }
  };

  const updatePaymentStatus = async (id: string, status: PaymentStatus) => {
    try {
      const updatedPayment = await paymentsAPI.updatePaymentStatus(id, status);

      setPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment.id === id ? updatedPayment : payment
        )
      );

      toast({
        title: 'Payment Updated',
        description: `Payment status updated to ${status}.`,
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: handleApiError(error),
      });
    }
  };

  const addLoan = async (loanData: LoanApplicationRequest) => {
    try {
      const newLoan = await loansAPI.applyForLoan(loanData);

      setLoans((prevLoans) => [newLoan, ...prevLoans]);

      toast({
        title: 'Loan Added',
        description: 'Loan added successfully.',
      });
    } catch (error) {
      console.error('Error adding loan:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: handleApiError(error),
      });
    }
  };

  const updateLoanStatus = async (id: string, status: LoanStatus) => {
    try {
      const updatedLoan = await loansAPI.updateLoanStatus(id, { status });

      setLoans((prevLoans) =>
        prevLoans.map((loan) => (loan.id === id ? updatedLoan : loan))
      );

      toast({
        title: 'Loan Updated',
        description: `Loan status updated to ${status}.`,
      });
    } catch (error) {
      console.error('Error updating loan status:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: handleApiError(error),
      });
    }
  };

  const addDue = async (dueData: CreateDueRequest) => {
    try {
      const newDue = await duesAPI.createDue(dueData);

      setDues((prevDues) => [newDue, ...prevDues]);

      toast({
        title: 'Due Added',
        description: 'Due added successfully.',
      });
    } catch (error) {
      console.error('Error adding due:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: handleApiError(error),
      });
    }
  };

  const updateDueStatus = async (id: string, status: PaymentStatus) => {
    try {
      const updatedDue = await duesAPI.updateDueStatus(id, { status });

      setDues((prevDues) =>
        prevDues.map((due) => (due.id === id ? updatedDue : due))
      );

      toast({
        title: 'Due Updated',
        description: `Due status updated to ${status}.`,
      });
    } catch (error) {
      console.error('Error updating due status:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: handleApiError(error),
      });
    }
  };

  const addReport = async (reportData: GenerateReportRequest) => {
    try {
      const newReport = await reportsAPI.generateReport(reportData);

      setReports((prevReports) => [newReport, ...prevReports]);

      toast({
        title: 'Report Added',
        description: 'Report added successfully.',
      });
    } catch (error) {
      console.error('Error adding report:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: handleApiError(error),
      });
    }
  };

  const updateUserSettings = async (settings: UpdateUserSettingsRequest) => {
    if (!user?.id) return;

    try {
      const updatedSettings = await userAPI.updateUserSettings(
        user.id,
        settings
      );

      setUserSettings(updatedSettings);

      toast({
        title: 'Settings Updated',
        description: 'User settings updated successfully.',
      });
    } catch (error) {
      console.error('Error updating user settings:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: handleApiError(error),
      });
    }
  };

  const getMemberById = (userId: string): Member | undefined => {
    return members.find((member) => member.id === userId);
  };

  const getMemberPayments = async (userId: string): Promise<Payment[]> => {
    try {
      return await paymentsAPI.getUserPaymentHistory(userId);
    } catch (error) {
      console.error('Error fetching member payments:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: handleApiError(error),
      });
      return [];
    }
  };

  const getMemberLoans = async (userId: string): Promise<Loan[]> => {
    try {
      return await loansAPI.getUserLoanHistory(userId);
    } catch (error) {
      console.error('Error fetching member loans:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: handleApiError(error),
      });
      return [];
    }
  };

  const applyForLoan = async (loanData: {
    userId: string;
    amount: number;
    purpose: string;
  }) => {
    try {
      const newLoan = await loansAPI.applyForLoan({
        userId: loanData.userId,
        amount: loanData.amount,
        purpose: loanData.purpose,
        applicationDate: new Date().toISOString(),
        status: LoanStatus.PENDING,
        repaymentTerms: '12 months',
        dueDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      });

      setLoans((prevLoans) => [newLoan, ...prevLoans]);

      toast({
        title: 'Loan Application Submitted',
        description: 'Your loan application has been submitted for review.',
      });
    } catch (error) {
      console.error('Error applying for loan:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: handleApiError(error),
      });
    }
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
    refreshData,
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
