/**
 * LeadPulse — Central Environment Configuration
 * All env vars are read from here. Throws at startup if required vars are missing.
 */

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `[LeadPulse] Missing required environment variable: "${key}"\n` +
      `Add it to .env.local or your Vercel Environment Variables dashboard.`
    );
  }
  return value;
};

const optional = (key: string, fallback = ""): string =>
  process.env[key] ?? fallback;

export const env = {
  app: {
    name: optional("APP_NAME", "LeadPulse"),
    url: optional("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
    nodeEnv: optional("NODE_ENV", "development"),
    isProd: process.env.NODE_ENV === "production",
  },
  supabase: {
    url: required("NEXT_PUBLIC_SUPABASE_URL"),
    anonKey: required("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    serviceRoleKey: required("SUPABASE_SERVICE_ROLE_KEY"),
  },
  clerk: {
    publishableKey: required("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"),
    secretKey: required("CLERK_SECRET_KEY"),
  },
  reddit: {
    clientId: required("REDDIT_CLIENT_ID"),
    clientSecret: required("REDDIT_CLIENT_SECRET"),
    userAgent: optional("REDDIT_USER_AGENT", "LeadPulse/1.0"),
  },
  twitter: {
    apiKey: required("TWITTER_API_KEY"),
    apiSecret: required("TWITTER_API_SECRET"),
    bearerToken: required("TWITTER_BEARER_TOKEN"),
  },
  openai: {
    apiKey: required("OPENAI_API_KEY"),
  },
  resend: {
    apiKey: required("RESEND_API_KEY"),
    fromEmail: optional("RESEND_FROM_EMAIL", "alerts@leadpulse.io"),
  },
  payu: {
    merchantKey: required("PAYU_MERCHANT_KEY"),
    merchantSalt: required("PAYU_MERCHANT_SALT"),
    baseUrl: optional("PAYU_BASE_URL", "https://secure.payu.in/_payment"),
  },
  security: {
    jwtSecret: required("JWT_SECRET"),
    cronSecret: required("CRON_SECRET"),
  },
} as const;
