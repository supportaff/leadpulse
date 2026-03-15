export const env = {
  supabase: {
    url: process.env.LP_SUPABASE_URL!,
    anonKey: process.env.LP_SUPABASE_ANON_KEY!,
    serviceKey: process.env.LP_SUPABASE_SERVICE_ROLE_KEY!,
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY!,
  },
  resend: {
    apiKey: process.env.RESEND_API_KEY!,
    fromEmail: process.env.RESEND_FROM_EMAIL ?? 'alerts@leadpulse.io',
  },
  payu: {
    merchantKey: process.env.PAYU_MERCHANT_KEY!,
    merchantSalt: process.env.PAYU_MERCHANT_SALT!,
    baseUrl: process.env.PAYU_BASE_URL ?? 'https://secure.payu.in/_payment',
  },
  reddit: {
    clientId: process.env.REDDIT_CLIENT_ID!,
    clientSecret: process.env.REDDIT_CLIENT_SECRET!,
    userAgent: process.env.REDDIT_USER_AGENT ?? 'LeadPulse/1.0',
  },
  twitter: {
    bearerToken: process.env.TWITTER_BEARER_TOKEN!,
  },
  security: {
    cronSecret: process.env.CRON_SECRET!,
    jwtSecret: process.env.JWT_SECRET!,
  },
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
    name: process.env.APP_NAME ?? 'LeadPulse',
  },
};
