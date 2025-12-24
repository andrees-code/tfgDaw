import { Document } from 'mongoose';
import { User } from './user.interface';

// No redefinimos _id
export interface UserDocument extends Omit<User, '_id'>, Document {
  password: string; // solo backend
}
