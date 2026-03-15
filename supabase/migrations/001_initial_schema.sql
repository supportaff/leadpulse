-- LeadPulse — Initial Supabase Schema
-- Run this in your Supabase SQL editor or via supabase db push

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id        TEXT UNIQUE NOT NULL,
  email           TEXT UNIQUE NOT NULL,
  full_name       TEXT,
  avatar_url      TEXT,
  plan            TEXT NOT NULL DEFAULT 'free'
                    CHECK (plan IN ('free','starter','growth','pro')),
  plan_expires_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- USAGE TRACKING
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS usage (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID REFERENCES users(id) ON DELETE CASCADE,
  month               TEXT NOT NULL,
  leads_detected      INT DEFAULT 0,
  replies_generated   INT DEFAULT 0,
  keywords_active     INT DEFAULT 0,
  UNIQUE(user_id, month)
);

CREATE OR REPLACE FUNCTION increment_usage(
  p_user_id UUID,
  p_month TEXT,
  p_field TEXT
) RETURNS VOID AS $$
BEGIN
  INSERT INTO usage (user_id, month, leads_detected, replies_generated, keywords_active)
    VALUES (p_user_id, p_month, 0, 0, 0)
    ON CONFLICT (user_id, month) DO NOTHING;

  IF p_field = 'leads_detected' THEN
    UPDATE usage SET leads_detected = leads_detected + 1
      WHERE user_id = p_user_id AND month = p_month;
  ELSIF p_field = 'replies_generated' THEN
    UPDATE usage SET replies_generated = replies_generated + 1
      WHERE user_id = p_user_id AND month = p_month;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ─────────────────────────────────────────
-- CAMPAIGNS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS campaigns (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  keywords    TEXT[] NOT NULL DEFAULT '{}',
  platforms   TEXT[] NOT NULL DEFAULT '{reddit,twitter}',
  subreddits  TEXT[] DEFAULT '{}',
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- LEADS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID REFERENCES users(id) ON DELETE CASCADE,
  campaign_id       UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  platform          TEXT NOT NULL CHECK (platform IN ('reddit','twitter')),
  post_id           TEXT NOT NULL,
  post_url          TEXT NOT NULL,
  post_title        TEXT,
  post_body         TEXT NOT NULL,
  author_username   TEXT,
  subreddit         TEXT,
  intent_score      SMALLINT CHECK (intent_score BETWEEN 0 AND 100),
  intent_level      TEXT CHECK (intent_level IN ('high','medium','low')),
  matched_keywords  TEXT[] DEFAULT '{}',
  ai_summary        TEXT,
  ai_reply          TEXT,
  reply_used        BOOLEAN DEFAULT FALSE,
  reply_used_at     TIMESTAMPTZ,
  status            TEXT DEFAULT 'new'
                      CHECK (status IN ('new','reviewed','replied','ignored')),
  is_competitor     BOOLEAN DEFAULT FALSE,
  competitor_name   TEXT,
  posted_at         TIMESTAMPTZ,
  detected_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, platform, post_id)
);

-- ─────────────────────────────────────────
-- NOTIFICATIONS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id   UUID REFERENCES users(id) ON DELETE CASCADE,
  lead_id   UUID REFERENCES leads(id) ON DELETE CASCADE,
  type      TEXT NOT NULL CHECK (type IN ('high_intent','competitor','daily_digest')),
  channel   TEXT NOT NULL CHECK (channel IN ('email','dashboard')),
  sent_at   TIMESTAMPTZ DEFAULT NOW(),
  is_read   BOOLEAN DEFAULT FALSE
);

-- ─────────────────────────────────────────
-- SUBSCRIPTIONS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscriptions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  payu_txn_id   TEXT UNIQUE,
  plan          TEXT NOT NULL,
  amount        NUMERIC(10,2),
  currency      TEXT DEFAULT 'USD',
  status        TEXT CHECK (status IN ('pending','success','failed','refunded')),
  starts_at     TIMESTAMPTZ,
  expires_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_leads_user_id       ON leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_intent_level  ON leads(intent_level);
CREATE INDEX IF NOT EXISTS idx_leads_platform      ON leads(platform);
CREATE INDEX IF NOT EXISTS idx_leads_detected_at   ON leads(detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status        ON leads(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id   ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_active    ON campaigns(is_active) WHERE is_active = TRUE;

-- ─────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────
ALTER TABLE users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads         ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns     ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage         ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
