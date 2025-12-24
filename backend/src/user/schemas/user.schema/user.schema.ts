import { Schema, Document } from "mongoose";

export interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  avatar: string | null;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = new Schema<UserDocument>({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar: { type: String, default: null },
  lastLogin: { type: Date, default: null },
}, { timestamps: true });
