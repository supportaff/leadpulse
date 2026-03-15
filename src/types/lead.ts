export type IntentLevel = 'high' | 'medium' | 'low';
export type LeadStatus = 'new' | 'reviewed' | 'replied' | 'ignored';
export type Platform = 'reddit' | 'twitter';

export interface Lead {
  id: string;
  user_id: string;
  campaign_id: string | null;
  platform: Platform;
  post_id: string;
  post_url: string;
  post_title: string | null;
  post_body: string;
  author_username: string | null;
  subreddit: string | null;
  intent_score: number;
  intent_level: IntentLevel;
  matched_keywords: string[];
  ai_summary: string | null;
  ai_reply: string | null;
  reply_used: boolean;
  reply_used_at: string | null;
  status: LeadStatus;
  is_competitor: boolean;
  competitor_name: string | null;
  posted_at: string | null;
  detected_at: string;
}
