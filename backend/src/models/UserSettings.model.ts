import { Schema, model, Types } from 'mongoose';
import {
  IUserSettingsDocument,
  ThemePreference,
} from '../types/userSettings.types';

const UserSettingsSchema = new Schema<IUserSettingsDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
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
      enum: ['light', 'dark', 'system'] satisfies ThemePreference[],
      default: 'light',
    },
    language: {
      type: String,
      default: 'en',
      match: /^[a-z]{2}(-[A-Z]{2})?$/, // en or en-US format
    },
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

export const UserSettings = model<IUserSettingsDocument>(
  'UserSettings',
  UserSettingsSchema
);
