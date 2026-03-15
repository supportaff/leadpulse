// Single source of truth for all plan definitions and limits
export const PLANS = {
  starter: {
    key: 'starter',
    label: 'Starter',
    price: 499,
    currency: 'INR',
    productinfo: 'LeadPulse Starter Plan – 3 Campaigns, 100 Leads/month',
    payuLink: 'https://v.payu.in/PAYUMN/VIWsBvRYSU9b', // ₹499/month
    limits: {
      campaigns: 3,
      leadsPerMonth: 100,
      aiRepliesPerMonth: 30,
    },
    features: ['3 campaigns', '100 leads / month', '30 AI replies / month', 'Email alerts', 'Basic analytics'],
  },
  growth: {
    key: 'growth',
    label: 'Growth',
    price: 999,
    currency: 'INR',
    productinfo: 'LeadPulse Growth Plan – 10 Campaigns, 500 Leads/month',
    payuLink: null, // TODO: create ₹999 PayU subscription link
    popular: true,
    limits: {
      campaigns: 10,
      leadsPerMonth: 500,
      aiRepliesPerMonth: 150,
    },
    features: ['10 campaigns', '500 leads / month', '150 AI replies / month', 'Email alerts', 'Competitor monitoring', 'Priority support'],
  },
  pro: {
    key: 'pro',
    label: 'Pro',
    price: 1499,
    currency: 'INR',
    productinfo: 'LeadPulse Pro Plan – Unlimited Campaigns, 2000 Leads/month',
    payuLink: null, // TODO: create ₹1499 PayU subscription link
    limits: {
      campaigns: 999,
      leadsPerMonth: 2000,
      aiRepliesPerMonth: 500,
    },
    features: ['Unlimited campaigns', '2000 leads / month', '500 AI replies / month', 'Email alerts', 'Competitor monitoring', 'API access', 'White-label ready'],
  },
} as const;

export type PlanKey = keyof typeof PLANS;

export function getPlan(key: string) {
  return PLANS[key as PlanKey] ?? null;
}

export function getPlanLimits(key: string) {
  return getPlan(key)?.limits ?? PLANS.starter.limits;
}
