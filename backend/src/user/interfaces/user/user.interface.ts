import { Subscription } from '../../subscriptions/subscription.interface';

export interface AiUsage {
  examsThisMonth: number;
  resetAt: Date;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  avatar: string | null;
  lastLogin?: Date;

  // 👇 Suscripción (YA EXISTENTE)
  subscription: Subscription;

  // 👇 NUEVO: control de uso de IA
  aiUsage: AiUsage;

  createdAt: Date;
  updatedAt: Date;
}
