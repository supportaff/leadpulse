// LeadPulse uses a wallet model (₹10/lead)
// Plans are kept as a reference for AI reply limits only
// See src/lib/wallet.ts for top-up packs

export const PLAN_LIMITS = {
  starter: { aiRepliesPerMonth: 30 },
  growth:  { aiRepliesPerMonth: 150 },
  pro:     { aiRepliesPerMonth: 500 },
} as const;

export type PlanKey = keyof typeof PLAN_LIMITS;

export function getPlan(key: string) {
  return PLAN_LIMITS[key as PlanKey] ?? null;
}

export function getPlanLimits(key: string) {
  return PLAN_LIMITS[key as PlanKey] ?? PLAN_LIMITS.starter;
}
