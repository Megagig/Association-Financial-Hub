import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/user.model';
import { Report } from '../models/report.model';
import { Member } from '../models/member.model';
import { Payment } from '../models/payment.model';
import { Loan } from '../models/loan.model';
import { UserRole } from '../types/user.types';

// Get all reports
export const getAllReports = async (req: Request, res: Response) => {
  try {
    const reports = await Report.find().sort({ generatedAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get report by ID
export const getReportById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid report ID' });
      return;
    }

    const report = await Report.findById(id);

    if (!report) {
      res.status(404).json({ message: 'Report not found' });
      return;
    }

    res.status(200).json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Generate a new report
export const generateReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, description, dateRange, type, generatedBy } = req.body;

    // Check if generator exists and is an admin
    const generator = await User.findById(generatedBy);
    if (
      !generator ||
      generator.role?.toString() !== UserRole.ADMIN.toString()
    ) {
      res.status(400).json({ message: 'Invalid generator or not an admin' });
      return;
    }

    // Parse date range
    const fromDate = new Date(dateRange.from);
    const toDate = new Date(dateRange.to);

    // Generate report data based on type
    let reportData: any = {};

    switch (type) {
      case 'payments': {
        const payments = await Payment.find({
          date: { $gte: fromDate, $lte: toDate },
        }).sort({ date: -1 });

        // Calculate summaries
        const totalAmount = payments.reduce(
          (sum, payment) => sum + payment.amount,
          0
        );
        const typeBreakdown = payments.reduce((acc: any, payment) => {
          acc[payment.type] = (acc[payment.type] || 0) + payment.amount;
          return acc;
        }, {});

        const statusBreakdown = payments.reduce((acc: any, payment) => {
          acc[payment.status] = (acc[payment.status] || 0) + 1;
          return acc;
        }, {});

        reportData = {
          payments,
          totalAmount,
          typeBreakdown,
          statusBreakdown,
          count: payments.length,
        };
        break;
      }
      case 'dues': {
        // Similar to payments but for dues (implementation would depend on your dues model)
        reportData = {
          message: 'Dues report implementation would go here',
        };
        break;
      }
      case 'loans': {
        const loans = await Loan.find({
          applicationDate: { $gte: fromDate, $lte: toDate },
        }).sort({ applicationDate: -1 });

        // Calculate summaries
        const totalAmount = loans.reduce((sum, loan) => sum + loan.amount, 0);
        const statusBreakdown = loans.reduce((acc: any, loan) => {
          acc[loan.status] = (acc[loan.status] || 0) + 1;
          return acc;
        }, {});

        const approvedAmount = loans
          .filter((loan) => loan.status === 'approved')
          .reduce((sum, loan) => sum + loan.amount, 0);

        reportData = {
          loans,
          totalAmount,
          approvedAmount,
          statusBreakdown,
          count: loans.length,
        };
        break;
      }
      case 'summary': {
        // Member stats
        const totalMembers = await Member.countDocuments();
        const newMembers = await Member.countDocuments({
          memberSince: { $gte: fromDate, $lte: toDate },
        });

        // Payment stats
        const payments = await Payment.find({
          date: { $gte: fromDate, $lte: toDate },
        });

        const totalPaymentsAmount = payments.reduce(
          (sum, payment) => sum + payment.amount,
          0
        );

        const paymentsByType = payments.reduce((acc: any, payment) => {
          acc[payment.type] = (acc[payment.type] || 0) + payment.amount;
          return acc;
        }, {});

        // Loan stats
        const loans = await Loan.find({
          applicationDate: { $gte: fromDate, $lte: toDate },
        });

        const totalLoansAmount = loans.reduce(
          (sum, loan) => sum + loan.amount,
          0
        );

        const approvedLoansAmount = loans
          .filter((loan) => loan.status === 'approved')
          .reduce((sum, loan) => sum + loan.amount, 0);

        reportData = {
          period: {
            from: fromDate,
            to: toDate,
          },
          members: {
            total: totalMembers,
            new: newMembers,
          },
          payments: {
            total: totalPaymentsAmount,
            byType: paymentsByType,
            count: payments.length,
          },
          loans: {
            total: totalLoansAmount,
            approved: approvedLoansAmount,
            count: loans.length,
          },
        };
        break;
      }
      default:
        res.status(400).json({ message: 'Invalid report type' });
        return;
    }

    // Create new report
    const report = new Report({
      title,
      description,
      dateRange: {
        from: fromDate,
        to: toDate,
      },
      type,
      generatedBy,
      generatedAt: new Date(),
      data: reportData,
    });

    await report.save();
    res.status(201).json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
