-- ============================================================
-- FinanceAI — Supabase Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL > New Query)
-- ============================================================

-- 1. WALLETS
-- Stores credit balance per user (1 credit = ₹10)
create table if not exists wallets (
  id           uuid primary key default gen_random_uuid(),
  user_id      text not null unique,          -- Clerk user ID
  credits      integer not null default 0,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- Auto-update updated_at on wallet changes
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists wallets_updated_at on wallets;
create trigger wallets_updated_at
  before update on wallets
  for each row execute function update_updated_at();

-- 2. WALLET TRANSACTIONS
-- Logs every top-up and AI usage deduction
create table if not exists wallet_transactions (
  id              uuid primary key default gen_random_uuid(),
  user_id         text not null,
  amount_inr      integer not null,           -- positive = top-up, negative = AI usage
  credits_added   integer not null,           -- positive = top-up, negative = deduction
  status          text not null default 'pending',
                  -- 'pending' | 'success' | 'failed' | 'ai_usage'
  payu_txn_id     text,                       -- PayU transaction ID or AI_DEBT_/AI_INS_ prefix
  plan_name       text,                       -- 'starter' | 'popular' | 'power' (top-ups only)
  created_at      timestamptz default now()
);

create index if not exists idx_wallet_txn_user on wallet_transactions(user_id);
create index if not exists idx_wallet_txn_status on wallet_transactions(status);

-- 3. AI USAGE LOGS
-- Optional: detailed log of every AI call for analytics / abuse prevention
create table if not exists ai_usage_logs (
  id            uuid primary key default gen_random_uuid(),
  user_id       text not null,
  tool          text not null,                -- 'debt_plan' | 'insurance_plan'
  credits_used  integer not null default 1,
  prompt_tokens integer,                      -- optional: track Gemini token usage
  created_at    timestamptz default now()
);

create index if not exists idx_ai_usage_user on ai_usage_logs(user_id);
create index if not exists idx_ai_usage_tool on ai_usage_logs(tool);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table wallets enable row level security;
alter table wallet_transactions enable row level security;
alter table ai_usage_logs enable row level security;

-- Wallets: users can only read their own wallet
create policy "wallet_select_own" on wallets
  for select using (user_id = requesting_user_id());

-- Note: wallet updates must go through API routes (service role key)
-- so no update policy for users — server handles all mutations

-- Wallet transactions: users can only see their own
create policy "txn_select_own" on wallet_transactions
  for select using (user_id = requesting_user_id());

-- AI usage: users can only see their own
create policy "ai_usage_select_own" on ai_usage_logs
  for select using (user_id = requesting_user_id());

-- ============================================================
-- HELPER: requesting_user_id() from Clerk JWT
-- Add this in Supabase Dashboard > Auth > Hooks OR use below
-- ============================================================
create or replace function requesting_user_id()
returns text language sql stable as $$
  select nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')
$$;

-- ============================================================
-- SEED: auto-create wallet on new user (via Clerk webhook)
-- OR call this from your /api/auth/sync route:
--   insert into wallets (user_id, credits) values ($1, 0)
--   on conflict (user_id) do nothing;
-- ============================================================

-- ============================================================
-- SUMMARY OF TABLES
-- wallets              — 1 row per user, stores credit balance
-- wallet_transactions  — every top-up (PayU) and AI deduction
-- ai_usage_logs        — detailed per-call log for analytics
-- ============================================================
