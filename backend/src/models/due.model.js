"use strict";
// import { Schema, model, Types } from 'mongoose';
// import { IDueDocument, DueType, PaymentStatus } from '../types/due.types';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Due = void 0;
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
const mongoose_1 = __importStar(require("mongoose"));
const due_types_1 = require("../types/due.types");
const DueSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        enum: Object.values(due_types_1.DueType),
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
        validate: {
            validator: (date) => date > new Date(),
            message: 'Due date must be in the future',
        },
    },
    status: {
        type: String,
        enum: Object.values(due_types_1.PaymentStatus),
        default: due_types_1.PaymentStatus.PENDING,
    },
    paidAmount: {
        type: Number,
        default: 0,
        validate: {
            validator: function (amount) {
                return amount <= this.amount;
            },
            message: 'Paid amount cannot exceed due amount',
        },
    },
    issuedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    deletionReason: {
        type: String,
        default: null,
        maxlength: 500,
    },
    restoredAt: { type: Date }, // Added restoredAt field
    restoredBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }, // Added restoredBy field
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
        },
    },
});
// Add indexes
DueSchema.index({ dueDate: 1 }); // For finding upcoming dues
DueSchema.index({ userId: 1, status: 1 }); // For user-specific queries
DueSchema.index({ isDeleted: 1 }); // For querying active/deleted dues
exports.Due = (0, mongoose_1.model)('Due', DueSchema);
