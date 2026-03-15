export type Plan = 'free' | 'starter' | 'growth' | 'pro';

export interface Subscription {
  id: string;
  user_id: string;
  payu_txn_id: string | null;
  plan: Plan;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed' | 'refunded';
  starts_at: string | null;
  expires_at: string | null;
  created_at: string;
}

export const PLAN_LIMITS: Record<Plan, { keywords: number; leads: number; replies: number }> = {
  free:    { keywords: 2,         leads: 20,        replies: 10 },
  starter: { keywords: 5,         leads: 100,       replies: 50 },
  growth:  { keywords: 15,        leads: 500,       replies: 250 },
  pro:     { keywords: Infinity,  leads: Infinity,  replies: Infinity },
};

export const PLAN_PRICES: Record<Exclude<Plan, 'free'>, { monthly: number; label: string }> = {
  starter: { monthly: 14, label: 'Starter' },
  growth:  { monthly: 22, label: 'Growth' },
  pro:     { monthly: 30, label: 'Pro' },
};
