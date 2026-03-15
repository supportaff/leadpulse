// Single source of truth — all types live in their own files
export type { IntentLevel, LeadStatus, Platform, Lead } from './lead';
export type { Campaign, CreateCampaignInput } from './campaign';
export type { Plan, Subscription } from './subscription';

// Types only defined here
export type { UserProfile, UsageStats };

interface UserProfile {
  id: string;
  clerk_id: string;
  email: string;
  full_name: string | null;
  plan: import('./subscription').Plan;
  plan_expires_at: string | null;
  created_at: string;
}

interface UsageStats {
  leads_detected: number;
  replies_generated: number;
  keywords_active: number;
}
