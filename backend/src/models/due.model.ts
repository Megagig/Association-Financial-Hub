// import { Schema, model, Types } from 'mongoose';
// import { IDueDocument, DueType, PaymentStatus } from '../types/due.types';

// const DueSchema = new Schema<IDueDocument>(
//   {
//     userId: {
//       type: Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//       index: true,
//     },
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//       maxlength: 100,
//     },
//     description: {
//       type: String,
//       required: true,
//       trim: true,
//       maxlength: 500,
//     },
//     amount: {
//       type: Number,
//       required: true,
//       min: 0.01, // Minimum due amount
//     },
//     type: {
//       type: String,
//       enum: Object.values(DueType),
//       required: true,
//     },
//     dueDate: {
//       type: Date,
//       required: true,
//       validate: {
//         validator: (date: Date) => date > new Date(),
//         message: 'Due date must be in the future',
//       },
//     },
//     status: {
//       type: String,
//       enum: Object.values(PaymentStatus),
//       default: PaymentStatus.PENDING,
//     },
//     paidAmount: {
//       type: Number,
//       default: 0,
//       validate: {
//         validator: function (this: IDueDocument, amount: number) {
//           return amount <= this.amount;
//         },
//         message: 'Paid amount cannot exceed due amount',
//       },
//     },
//     issuedBy: {
//       type: Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//     toJSON: {
//       transform(doc, ret) {
//         ret.id = ret._id.toString();
//         delete ret._id;
//         delete ret.__v;
//       },
//     },
//   }
// );

// // // Indexes
// // DueSchema.index({ dueDate: 1 }); // For finding upcoming dues
// // DueSchema.index({ userId: 1, status: 1 }); // For user-specific queries

// export const Due = model<IDueDocument>('Due', DueSchema);

// First, update the Due model schema
import mongoose, { Schema, model, Types } from 'mongoose';
import { IDueDocument, DueType, PaymentStatus } from '../types/due.types';

const DueSchema = new Schema<IDueDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
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
    amount: {
      type: Number,
      required: true,
      min: 0.01, // Minimum due amount
    },
    type: {
      type: String,
      enum: Object.values(DueType),
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
      validate: {
        validator: (date: Date) => date > new Date(),
        message: 'Due date must be in the future',
      },
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    paidAmount: {
      type: Number,
      default: 0,
      validate: {
        validator: function (this: IDueDocument, amount: number) {
          return amount <= this.amount;
        },
        message: 'Paid amount cannot exceed due amount',
      },
    },
    issuedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    deletionReason: {
      type: String,
      default: null,
      maxlength: 500,
    },
    restoredAt: { type: Date }, // Added restoredAt field
    restoredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Added restoredBy field
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// Add indexes
DueSchema.index({ dueDate: 1 }); // For finding upcoming dues
DueSchema.index({ userId: 1, status: 1 }); // For user-specific queries
DueSchema.index({ isDeleted: 1 }); // For querying active/deleted dues

export const Due = model<IDueDocument>('Due', DueSchema);
