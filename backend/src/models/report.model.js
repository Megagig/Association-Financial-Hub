"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Report = void 0;
const mongoose_1 = require("mongoose");
const ReportSchema = new mongoose_1.Schema({
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
                validator: function (date) {
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
        ],
        required: true,
    },
    generatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    generatedAt: {
        type: Date,
        default: Date.now,
    },
    data: {
        type: mongoose_1.Schema.Types.Mixed,
        required: true,
    },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            delete ret.data; // Excluded by default for security
        },
    },
});
// Indexes for common queries
ReportSchema.index({ type: 1, 'dateRange.from': 1 });
ReportSchema.index({ generatedBy: 1, generatedAt: -1 });
exports.Report = (0, mongoose_1.model)('Report', ReportSchema);
