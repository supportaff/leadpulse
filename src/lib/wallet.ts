// Wallet configuration
export const LEAD_COST_INR = 10; // ₹10 per lead unlock

// Top-up packs — user picks one
export const TOPUP_PACKS = [
  { id: 'pack_100',  amount: 100,  leads: 10,  label: '₹100',  sublabel: '10 leads' },
  { id: 'pack_250',  amount: 250,  leads: 25,  label: '₹250',  sublabel: '25 leads',  popular: true },
  { id: 'pack_500',  amount: 500,  leads: 50,  label: '₹500',  sublabel: '50 leads' },
  { id: 'pack_1000', amount: 1000, leads: 100, label: '₹1000', sublabel: '100 leads', best: true },
] as const;

export type TopupPackId = typeof TOPUP_PACKS[number]['id'];

export function getTopupPack(id: string) {
  return TOPUP_PACKS.find(p => p.id === id) ?? null;
}
