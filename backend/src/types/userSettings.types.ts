import { Types } from 'mongoose';

// Union type for theme options (better than string literals)
export type ThemePreference = 'light' | 'dark' | 'system';

// Base interface (database-agnostic)
export interface IUserSettings {
  userId: Types.ObjectId;
  emailNotifications: boolean;
  paymentReminders: boolean;
  dueReminders: boolean;
  theme: ThemePreference;
  language: string;
}

// Extended for Mongoose documents
export interface IUserSettingsDocument extends IUserSettings, Document {
  createdAt: Date;
  updatedAt: Date;
}

// DTO for updating settings
export type UpdateSettingsDto = Partial<Omit<IUserSettings, 'userId'>>;

// DTO for API responses
export type SettingsResponse = Omit<IUserSettings, 'userId'> & {
  id: string;
  userId: string;
};
