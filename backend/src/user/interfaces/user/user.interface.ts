export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  avatar: string | null;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}