// Plans removed — LeadPulse uses a wallet model (pay-per-lead, ₹10/lead)
// See src/lib/wallet.ts for top-up packs and lead cost config

export function getPlanLimits() {
  // No plan limits in wallet model — usage is gated by wallet balance
  return null;
}
