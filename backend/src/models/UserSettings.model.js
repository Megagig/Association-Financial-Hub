"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSettings = void 0;
const mongoose_1 = require("mongoose");
const UserSettingsSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true,
    },
    emailNotifications: {
        type: Boolean,
        default: true,
    },
    paymentReminders: {
        type: Boolean,
        default: true,
    },
    dueReminders: {
        type: Boolean,
        default: true,
    },
    theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'light',
    },
    language: {
        type: String,
        default: 'en',
        match: /^[a-z]{2}(-[A-Z]{2})?$/, // en or en-US format
    },
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
exports.UserSettings = (0, mongoose_1.model)('UserSettings', UserSettingsSchema);
