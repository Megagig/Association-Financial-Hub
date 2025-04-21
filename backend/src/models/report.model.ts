import { Schema, model, Types } from 'mongoose';
import { IReportDocument, ReportType } from '../types/report.types';

const ReportSchema = new Schema<IReportDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    dateRange: {
      from: {
        type: Date,
        required: true,
        validate: {
          validator: function (this: IReportDocument, date: Date) {
            return date <= this.dateRange.to;
          },
          message: 'Start date must be before end date',
        },
      },
      to: {
        type: Date,
        required: true,
      },
    },
    type: {
      type: String,
      enum: [
        'dues',
        'payments',
        'loans',
        'donations',
        'summary',
        'member',
      ] satisfies ReportType[],
      required: true,
    },
    generatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.data; // Excluded by default for security
      },
    },
  }
);

// Indexes for common queries
ReportSchema.index({ type: 1, 'dateRange.from': 1 });
ReportSchema.index({ generatedBy: 1, generatedAt: -1 });

export const Report = model<IReportDocument>('Report', ReportSchema);
