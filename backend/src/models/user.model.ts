import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the User types
export type UserType = {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: {
    type: String;
    enum: ['user', 'admin', 'superadmin'];
    default: 'user';
  };
};

// Create user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'superadmin'],
    default: 'user',
  },
});

// Add password encryption middleware
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
// Create and export the model
const User = mongoose.model<UserType>('User', userSchema);
export default User;
