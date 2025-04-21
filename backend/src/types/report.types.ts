import { Types } from 'mongoose';

// Union type for report types (better than string literals)
export type ReportType =
  | 'dues'
  | 'payments'
  | 'loans'
  | 'levy'
  | 'summary'
  | 'member';

// Base interface (database-agnostic)
export interface IReport {
  title: string;
  description: string;
  dateRange: {
    from: Date;
    to: Date;
  };
  type: ReportType;
  generatedBy: Types.ObjectId;
  generatedAt: Date;
  data: Record<string, unknown>; // Better than 'any'
}

// Extended for Mongoose documents
export interface IReportDocument extends IReport, Document {
  createdAt: Date;
  updatedAt: Date;
}

// DTO for creating reports
export type CreateReportDto = Omit<IReport, 'generatedAt'> & {
  dateRange: {
    from: string; // ISO date string
    to: string;
  };
};

// DTO for API responses
export type ReportResponse = Omit<IReport, 'generatedBy' | 'data'> & {
  id: string;
  generatedBy: string;
  dateRange: {
    from: string;
    to: string;
  };
  generatedAt: string;
  metadata?: {
    recordCount?: number;
    totalAmount?: number;
  };
};
