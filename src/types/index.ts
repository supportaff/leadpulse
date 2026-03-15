export type IntentLevel = 'high' | 'medium' | 'low'
export type Platform = 'reddit' | 'twitter'
export type LeadStatus = 'new' | 'reviewed' | 'replied' | 'ignored'
export type Plan = 'free' | 'starter' | 'growth' | 'pro'

export interface Lead {
  id: string
  user_id: string
  campaign_id: string | null
  platform: Platform
  post_id: string
  post_url: string
  post_title: string | null
  post_body: string
  author_username: string | null
  subreddit: string | null
  intent_score: number
  intent_level: IntentLevel
  matched_keywords: string[]
  ai_summary: string | null
  ai_reply: string | null
  reply_used: boolean
  status: LeadStatus
  is_competitor: boolean
  competitor_name: string | null
  posted_at: string | null
  detected_at: string
}

export interface Campaign {
  id: string
  user_id: string
  name: string
  description: string | null
  keywords: string[]
  platforms: Platform[]
  subreddits: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  clerk_id: string
  email: string
  full_name: string | null
  plan: Plan
  plan_expires_at: string | null
  created_at: string
}

export interface UsageStats {
  leads_detected: number
  replies_generated: number
  keywords_active: number
}
