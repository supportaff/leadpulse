// LeadPulse uses a wallet model (₹10/lead) — no plan limits
// This file kept for backward compatibility only

export const PLAN_LIMITS = {
  starter: { aiRepliesPerMonth: 30,  campaigns: 999, leadsPerMonth: 99999 },
  growth:  { aiRepliesPerMonth: 150, campaigns: 999, leadsPerMonth: 99999 },
  pro:     { aiRepliesPerMonth: 500, campaigns: 999, leadsPerMonth: 99999 },
} as const;

export type PlanKey = keyof typeof PLAN_LIMITS;

export function getPlan(key: string) {
  return PLAN_LIMITS[key as PlanKey] ?? null;
}

export function getPlanLimits(key: string) {
  return PLAN_LIMITS[key as PlanKey] ?? PLAN_LIMITS.starter;
}
