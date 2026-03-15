# ⚡ LeadPulse

> **Catch the signal before your competitors do.**  
> AI-powered social intent intelligence platform. Discover high-intent leads from Reddit & X (Twitter) and convert them with AI-generated replies.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, Tailwind CSS, TypeScript |
| Backend | Node.js, Next.js API Routes |
| Database | Supabase (PostgreSQL) |
| Auth | Clerk |
| AI | OpenAI GPT-4o-mini |
| Email | Resend |
| Payments | PayU |
| Hosting | Vercel |

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/supportaff/leadpulse.git
cd leadpulse
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
# Fill in all values in .env.local
```

### 3. Set up Supabase

Run `supabase/migrations/001_initial_schema.sql` in your Supabase SQL editor.

### 4. Configure Clerk webhooks

In your Clerk Dashboard → Webhooks, add endpoint:
```
https://yourdomain.com/api/webhooks/clerk
```
Enable events: `user.created`, `user.updated`, `user.deleted`

### 5. Run locally

```bash
npm run dev
```

---

## Pricing

| Plan | Price | Keywords | Leads/mo | AI Replies/mo |
|---|---|---|---|---|
| Starter | $14/mo | 5 | 100 | 50 |
| Growth | $22/mo | 15 | 500 | 250 |
| Pro | $30/mo | Unlimited | Unlimited | Unlimited |

---

## Project Structure

```
src/
├── app/
│   ├── (marketing)/     # Public landing pages
│   ├── (auth)/          # Clerk auth pages
│   ├── (dashboard)/     # Protected app
│   └── api/             # API routes
├── components/
│   ├── marketing/       # Landing page components
│   ├── dashboard/       # App UI components
│   └── shared/          # Reusable components
├── lib/                 # Integrations (Reddit, Twitter, OpenAI, PayU, Resend)
├── hooks/               # React hooks
└── types/               # TypeScript types

supabase/
└── migrations/          # SQL schema
```

---

## Environment Variables

See `.env.example` for all required variables. All config is managed via `src/lib/env.ts` with startup validation.

---

## Cron Jobs

Vercel runs `/api/cron/scan` every 30 minutes to scan Reddit and X for new buyer-intent leads across all active campaigns.

---

Built with ❤️ by [Afforal](https://github.com/supportaff)
