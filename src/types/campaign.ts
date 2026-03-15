export interface Campaign {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  keywords: string[];
  platforms: ('reddit' | 'twitter')[];
  subreddits: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCampaignInput {
  name: string;
  description?: string;
  keywords: string[];
  platforms: ('reddit' | 'twitter')[];
  subreddits?: string[];
}
